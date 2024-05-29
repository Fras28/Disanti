import { createSlice } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialState = {
  allProduct: [],
  copyallProducts: [],
  productCom:[],
  favProd: [],
  categorias:[],
  subCategorias:[],
  comercio:[],
  clave:"",
  comandas:[],
  comandasTrue:[],
  comandasFalse:[],
  usuarioComander:"",
  proveedor:[],
  egregos:[],
};


export const dataSlice = createSlice({
  name: "allData",
  initialState,
  reducers: {
    allProducts: (state, action) => {
      return {
        ...state,
        allProduct: action.payload,
        copyallProducts: action.payload,
      };
    },
    allCategorias: (state, action) => {
      return {
        ...state,
        categorias: action.payload,
      };
    },
    ProductsComander: (state, action) => {
      return {
        ...state,
        productCom: action.payload,
      };
    },

    allSubCategorias: (state, action) => {
      // Verificar si el objeto de la carga útil ya existe en el estado
      const isExisting = state.subCategorias.some(subCategoria => subCategoria.id === action.payload.id);
    
      // Si el objeto ya existe, no hacemos nada
      if (isExisting) {
        return state;
      }
    
      // Si el objeto no existe, lo agregamos al estado
      return {
        ...state,
        subCategorias: [...state.subCategorias, action.payload],
      };
    },
    fillComercio: (state, action) => {
      return {
        ...state,
        comercio: action.payload,
        categorias: action.payload.attributes.categorias.data,
      };
    },
    favProducts: (state, action) => {
      return {
        ...state,
        favProd: [...state.favProd, action.payload],
      };
    },
    fillClave: (state, action) => {
      return {
        ...state,
        clave: action.payload,
      };
    },
    fillUsuario: (state, action) => {
      return {
        ...state,
        usuarioComander: action.payload,
      };
    },
    fillProvee: (state, action) => {
      return {
        ...state,
        proveedor: action.payload,
      };
    },
    cancelBagProducts: (state, action) => {
      const indexProd = state.favProd.findIndex(
        (product) => product.attributes.name === action.payload
      );
      console.log(indexProd, "cancel bag product");
      if (indexProd !== -1) {
        return {
          ...state,
          favProd: [
            ...state.favProd.slice(0, indexProd),
            ...state.favProd.slice(indexProd + 1),
          ],
        };
      }
      return state;
    },
    SearchProducts: (state, action) => {
      return {
        ...state,
        copyallProducts: state.allProduct
          .filter((e) => e.name.includes(action.payload) === true)
          .slice(0, 10),
      };
    },
    fillComanda: (state, action) => {
      let newComandas = Array.isArray(action.payload) ? action.payload.flat() : [action.payload];
      
      // Obtener las comandas que ya existen en el estado
      const existingComandas = state.comandas;
    
      // Actualizar las comandas existentes con los nuevos valores
      const updatedComandas = existingComandas.map(existingComanda => {
        // Buscar la comanda correspondiente en los nuevos datos
        const updatedComanda = newComandas.find(newComanda => newComanda.id === existingComanda.id);
        // Si se encuentra una comanda actualizada, devolverla, de lo contrario, mantener la comanda existente
        return updatedComanda ? updatedComanda : existingComanda;
      });
    
      // Combinar las comandas existentes con las nuevas comandas que no estén en el estado
      const combinedComandas = [...updatedComandas, ...newComandas.filter(newComanda => !updatedComandas.find(comanda => comanda.id === newComanda.id))];
    
      // Ordenar las comandas: false primero, luego true
      combinedComandas.sort((a, b) => (a.attributes?.entregado === b.attributes?.entregado ? 0 : a.attributes?.entregado ? 1 : -1));
    
      // Filtrar comandas por Status
      const comandasTrue = combinedComandas.filter(comanda => comanda?.attributes?.entregado === true);
      const comandasFalse = combinedComandas.filter(comanda => comanda?.attributes?.entregado === false);
    
      return {
        ...state,
        comandas: combinedComandas,
        comandasTrue: comandasTrue,
        comandasFalse: comandasFalse,
      };
    },
    
  },
});

//   console.log(response.data.data.attributes.comercio.data.id, " esto es lo que trae el response de todos los arituclos");
//-------------------------------------------------------------------------------------------------------------------
//------------------------------------------ function Movies ------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

const API_CATEGORIAS = process.env.REACT_APP_API_STRAPI_CATEGORIAS;
const API_ORDER = process.env.REACT_APP_API_ORDER;
const API_PROVE = process.env.REACT_APP_API_POVEEDOR;
const API_US = process.env.REACT_APP_API_USERS;
const IDENTIFIERU = process.env.REACT_APP_IDENTIFIER;
const PASSWORDU = process.env.REACT_APP_PASSWORD;
const API_SUBCAT= process.env.REACT_APP_API_STRAPI_SUBCATEGORIAS;
const API_GENERAL = process.env.REACT_APP_API_STRAPI;
const API_INICIO = process.env.REACT_APP_API_INICIO
const API_2  = process.env.REACT_APP_API_CATEGORIA;
const API_BASE = process.env.REACT_APP_API_COMERCIO
const API_COMANDER_ART = process.env.REACT_APP_API_ARTICULOS_CATEGORIAS



const comercio = 4;




export const asyncAllProducts= () => {
  return async function (dispatch) {
    try {
      console.log("ejecutando async PRODUCTS");
      const response = await axios.get(`${API_BASE}${comercio}?populate=categorias.sub_categorias.articulos`);

      const articulosExtraidos = extraerArticulos(response.data.data);

      return dispatch(allProducts(articulosExtraidos));
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };
};

export const asyncProductComander= () => {
  return async function (dispatch) {
    try {
      console.log("ejecutando async asyncProductComander");
      const response = await axios.get(API_COMANDER_ART);

      const articulosExtraidos = response.data.data.attributes.categorias.data;

      return dispatch(ProductsComander(articulosExtraidos));
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };
};




const extraerArticulos = (data) => {
  // Verificar si existen atributos y categorías
  if (!data || !data.attributes || !data.attributes.categorias || !data.attributes.categorias.data) {
    console.error("La estructura de datos no es la esperada.");
    return [];
  }

  // Extraer los artículos de las subcategorías
  let articulos = [];
  data.attributes.categorias.data.forEach(categoria => {
    categoria.attributes.sub_categorias.data.forEach(subcategoria => {
      articulos = articulos.concat(subcategoria.attributes.articulos.data);
    });
  });

  return articulos;
};





export const asyncComercio = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(API_INICIO);

        return dispatch(fillComercio(response.data.data));
    
    } catch (error) {
      console.error("Error fetching data comercio:", error);
    }
  };
};

export const asyncCategorias = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(API_CATEGORIAS);
      const categoriasFiltradas = response.data.data.filter(categoria => categoria.attributes.comercio.data.id === comercio); // Filtrar las categorías cuyo comercio tenga el id igual al valor de la constante comercio
      const categoriasOrdenadas = categoriasFiltradas.sort((a, b) => a.id - b.id); // Ordenar las categorías filtradas
      return dispatch(allCategorias(categoriasOrdenadas));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};
export const asyncAllSubCategoria = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(API_SUBCAT);

      const categorias = response.data?.data?.attributes?.categorias?.data;
      if (!categorias) {
        throw new Error("No categories found in the response");
      }

      const subCategorias = categorias?.flatMap(categoria => 
        categoria?.attributes?.sub_categorias?.data.map(subCategoria => ({
          id: subCategoria.id,
          name: subCategoria?.attributes?.name,
          publishedAt: subCategoria?.attributes?.publishedAt
        }))
      );

      console.log("cargando subCategorias");

      return dispatch(allSubCategorias(subCategorias));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};


export const asyncSubCategoria = (id) => {

  return async function (dispatch) {
    try {
      const response = await axios.get(API_2+id+"?populate=sub_categorias.articulos");

      const subCategorias = response.data.data;


      return dispatch(allSubCategorias(subCategorias));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};



export const asyncfavProducts = (pedido) => {
  return async function (dispatch) {
    try {
      toast.success("Product removed from Agregado successfully!");
      return dispatch(favProducts(pedido));
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      // Show error notification
      toast.error("Error removing product from favorites. Please try again.");
    }
  };
};

export const asyncCancelFav = (pedido) => {
  return async function (dispatch) {
    try {
      dispatch(cancelBagProducts(pedido.attributes.name));

      // Show success notification
      toast.success("Product removed from favorites successfully!");
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      // Show error notification
      toast.error("Error removing product from favorites. Please try again.");
    }
  };
};

export const asyncSearchBar = (string) => {
  return async function (dispatch) {
    return dispatch(SearchProducts(string));
  };
};

export const asyncOrder = ({ metodo_de_pago, pedido,tipo_pedido, name, detalle, total_pedido, telefono, domicilio }) => {
  return async function (dispatch, getState) {
    try {
      // Use getState to retrieve the current state
      const initialState = getState();
      
      // Access the clave from the state
      const clave = initialState?.alldata?.clave;
      const CreatedBy = IDENTIFIERU;
      
      // Remove the unnecessary nesting of the 'data' property
      const data = {data:{ metodo_de_pago, pedido, name,tipo_pedido, detalle, total_pedido, telefono, domicilio }};

      // Perform the API request with the Authorization header
      await axios.post(API_ORDER, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clave}`, // Use clave from the state
        },
      });

      console.log("posteado correctamente, sliceee");
      return dispatch();
    } catch (error) {
      console.log(error, "from Order");
    }
  };
};


export const asyncProveedor = ({ name, telefono, email, direccion }, setStatusOrder) => {
  return async function (dispatch, getState) {
    try {
      // Use getState to retrieve the current state
      const initialState = getState();
      // Access the clave from the state
      const clave = initialState?.alldata?.clave;      
      // Remove the unnecessary nesting of the 'data' property
      const data = { name, telefono, email, direccion };
      // Perform the API request with the Authorization header
      await axios.post(API_PROVE, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clave}`, // Use clave from the state
        },
      });

      console.log("posteado correctamente, Proveedor");
      // Actualizar el estado para indicar que la orden se envió correctamente
      setStatusOrder(3);
    } catch (error) {
      console.log(error, "from Order");
    }
  };
};




export const asyncUser = () => {
  return async function (dispatch) {
    try {
      const data = {
        identifier:IDENTIFIERU,
        password:PASSWORDU
      };

      const response = await axios.post(API_US, data);
      const categoriasOrdenadas = response.data.jwt;

      return dispatch(fillClave(categoriasOrdenadas));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};


export const asyncLogIn = ({email,password}) => {
  return async function (dispatch) {
    try {
      const data = {
        identifier:email,
        password:password
      };

      const response = await axios.post(API_US, data);
      const ComanderJWT = response.data.jwt;

      return  dispatch(fillUsuario(ComanderJWT));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};


export const asyncAddProd = (data) => {
  return async function (dispatch, getState) {
    const initialState = getState();
    const usuarioComander = initialState?.alldata?.usuarioComander;

    try {
      const response = await axios.post(`${API_GENERAL}/api/articulos`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });
      console.log("producto editado creo q correctamente");
      toast.success("Producto agregado correctamente!");
      // Si asyncAllProducts es una acción de thunk, despacharla
      if (typeof asyncAllProducts === 'function') {
        dispatch(asyncAllProducts());
      }
      toast.success("Producto Agregado correctamente!");

    } catch (error) {
      console.error("Error fetching data EditProd Slice:", error);
    }
  };
};

export const asyncEditProd = (data, id) => {
  return async function (dispatch, getState) {
    const initialState = getState();
    const usuarioComander = initialState?.alldata?.usuarioComander;

    try {
      const response = await axios.put(`${API_GENERAL}/api/articulos/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });
      console.log("producto editado creo q correctamente");

      // Si asyncAllProducts es una acción de thunk, despacharla
      if (typeof asyncAllProducts === 'function') {
        dispatch(asyncAllProducts());
      }
      toast.success("Producto editado correctamente!");

    } catch (error) {
      console.error("Error fetching data EditProd Slice:", error);
    }
  };
};
export const asyncEditSub = (data,id) => {
  return async function (dispatch, getState) {
    const initialState = getState();
    const usuarioComander = initialState?.alldata?.usuarioComander;

    try {
      const response = await axios.put(`${API_GENERAL}/api/subcategorias/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });
      console.log("producto editado creo q correctamente");

      // Si asyncAllProducts es una acción de thunk, despacharla
      if (typeof asyncAllProducts === 'function') {
        dispatch(asyncAllSubCategoria());
      }
      toast.success("Sub Categoria editada correctamente!");

    } catch (error) {
      console.error("Error fetching data EditSubCat Slice:", error);
    }
  };
};


export const asyncPublishArtic = (data, id) => {
  return async function (dispatch, getState) {
    const initialState = getState();
    const usuarioComander = initialState?.alldata?.usuarioComander;

    try {
      const response = await axios.put(`${API_GENERAL}/api/articulos/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });
      console.log("producto editado creo q correctamente");
      console.log(response);

      // Si asyncAllProducts es una acción de thunk, despacharla
      if (typeof asyncAllProducts === 'function') {
        dispatch(asyncAllProducts());
      }
      toast.success("Producto despubli");

    } catch (error) {
      console.error("Error fetching data EditProd Slice:", error);
    }
  };
};

export const asyncPublishSubCat = (data, id) => {
  return async function (dispatch, getState) {
    const initialState = getState();
    const usuarioComander = initialState?.alldata?.usuarioComander;

    try {
      const response = await axios.put(`${API_GENERAL}/api/subcategorias/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });
      console.log("producto editado creo q correctamente");
      console.log(response);

      // Si asyncAllProducts es una acción de thunk, despacharla
      if (typeof asyncAllProducts === 'function') {
        dispatch(asyncAllSubCategoria());
      }
      toast.success("Sub categoria Modificada");

    } catch (error) {
      console.error("Error fetching data EditProd Slice:", error);
    }
  };
};





export const asyncComandas = () => {
  return async function (dispatch, getState) {
    try {
      const initialState = getState();
    
      const usuarioComander = initialState?.alldata?.usuarioComander;
 

      const response = await axios.get(API_ORDER, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });


      return dispatch(fillComanda(response?.data?.data));
    } catch (error) {
      console.error('Error al obtener comandas:', error);
      // Puedes dispatchar una acción para manejar el error según tus necesidades
    }
  };
};





export const asyncGetProv = () => {

  return async function (dispatch, getState) {
    try {
      const initialState = getState();
    
      const usuarioComander = initialState?.alldata?.usuarioComander;
 

      const response = await axios.get(API_PROVE, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });



      return dispatch(fillProvee(response?.data?.data));
    } catch (error) {
      console.error('Error al obtener comandas:', error);
      // Puedes dispatchar una acción para manejar el error según tus necesidades
    }
  };
};

 

export const asyncPedidoRealizado = (comanda) => {
  return async function (dispatch, getState) {
    try {
      const initialState = getState();
      const usuarioComander = initialState?.alldata?.usuarioComander;

      // Modifica solo el estado de la propiedad 'Status' a true o false
      const updatedComanda = {
        ...comanda.attributes,
        entregado: !comanda.attributes.entregado,
      };

      const response = await axios.put(`${API_ORDER}/${comanda.id}`, { data: updatedComanda }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuarioComander}`,
        },
      });

      // Después de realizar la edición, vuelve a obtener las comandas actualizadas
      await dispatch(asyncComandas());

      // Actualiza los estados comandasTrue y comandasFalse
      const updatedComandasTrue = getState().alldata.comandas.filter(comanda => comanda.attributes.entregado === true);
      const updatedComandasFalse = getState().alldata.comandas.filter(comanda => comanda.attributes.entregado === false);

      toast.success("Pedido realizado successfully!");
      return dispatch(fillComanda(response?.data?.data, updatedComandasTrue, updatedComandasFalse));
    } catch (error) {
      console.error('Error during pedido realizado:', error);
      // Show error notification
      toast.error("Error during pedido realizado. Please try again.");
    }
  };






  
};

//----------------------------------------------------------------------------------------------------------------

export const { allProducts, favProducts, cancelBagProducts, SearchProducts, allCategorias,allSubCategorias, fillComercio, fillClave, fillComanda,fillUsuario, fillProvee,ProductsComander } =
  dataSlice.actions;

export default dataSlice.reducer;
