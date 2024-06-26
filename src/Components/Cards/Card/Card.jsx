import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCancelFav, asyncfavProducts } from "../../redux/slice";
import "./Card.css";

export const Card = ({ producto }) => {
  let { favProd } = useSelector((state) => state.alldata);
  const dispatch = useDispatch();
  const [articles, setArticles] = useState({
    name: [],
    price:[]
  });
  const product = producto.attributes
  const thisFav = favProd?.filter((e) => e.attributes.name === product.name);


  let artAdd = function addArticle(e) {
    // e.preventDefault()
    setArticles({
      ...articles,
      name: [product.name],
      price: [product.price],
    });
    dispatch(asyncfavProducts(producto));
    
    setArticles({
      ...articles,
      name: [],
      price: [],
    });
  };

  let cancelFav = () => {
    dispatch(asyncCancelFav(producto));
  };

  return (
    <div className="CardCont">
        <h2 className="nameProd">{product.name}</h2>
        <div className="contCard">

      <div className="leftInfo">
        <p className="detProd">{product.detail}</p>
    
        {product.price2?
        <div style={{display:"flex", gap:"1.5rem", marginTop:".5rem"}}>
        <p className="price"> <b style={{fontSize:"12px" , borderRadius:"50%", whiteSpace:"nowrap"}}>{product.txtPrecio1}</b>  ${product.price}</p>
        {product.price2?<p className="price"><b style={{fontSize:"12px" , borderRadius:"50%", padding:"1px 3px"}}>{product.txtPrecio2}</b> ${product.price2}</p>:null}
       {product.price3 ?<p className="price"><b style={{fontSize:"12px" , borderRadius:"50%", whiteSpace:"nowrap"}}>{product.txtPrecio3}</b>  ${product.price3}</p>:null}
        </div>: <p className="price">${product.price}</p>}
      </div>
      <div className="rightInfo">
        <div className="divBtnProd">
          {thisFav.length === 0 ? (
            <button className="btnPlus" onClick={artAdd}>
              Agregar
            </button>
          ) : (
            <div className="masMenos">
              <button className="btn-svg" onClick={cancelFav}>
                -
              </button>
              <p className="cuantiti">{thisFav.length}</p>
              <button className="btn-svg" onClick={artAdd}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
        </div>
    </div>
  );
};
