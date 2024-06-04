import * as React from "react";
import Button from "@mui/material/Button";
import Logo from "../../assets/ElMundoParrilla-removebg-preview (2).png"
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { asyncOrder } from "../../redux/slice";
import "./ModalConfirmar.css";
const API = process.env.REACT_APP_API_STRAPI;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalConfirm({ total }) {
  const dispatch = useDispatch();
  const { comercio, favProd } = useSelector((state) => state.alldata);
  const [open, setOpen] = React.useState(false);

  const [statusOrder, setStatusOrder] = React.useState(1);

  const groupedProducts = {};
  favProd.forEach((product) => {
    const key = `${product?.attributes?.name} - ${product?.attributes?.price}`;
    groupedProducts[key] = (groupedProducts[key] || 0) + 1;
  });

  const orderString = Object.entries(groupedProducts)
    .map(([productInfo, count]) => {
      const [name, price] = productInfo?.split(" - ");
      return `${name} ($${price}) x${count}`;
    })
    .join(", ");

  const [order, setOrder] = React.useState({
    total_pedido: total,
    metodo_de_pago: "",
    pedido: orderString,
    name: "",
    Detail: "",
    tipo_pedido: "",
    telefono: "291",
    domicilio: "",
  });

  const handleTelefonoChange = (e) => {
    setOrder({
      ...order,
      telefono: e.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOrder = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const whatsappMessage = Object.entries(groupedProducts)
    .map(([productInfo, count]) => {
      const [name, price] = productInfo.split(" - ");
      return `${name} ($${price}) x${count},`;
    })
    .join(", ");

  const whatsappLink = `http://wa.me/${comercio[0]?.attributes?.whatsapp}?text=Hola ${comercio[0]?.attributes?.name} Mensaje de mi pedido ➤ ${whatsappMessage} Total = $ ${total}, ${order?.metodo_de_pago}`;

  const sendComanda = async (e) => {
    e.preventDefault(); // Prevenir la acción por defecto del enlace

    try {
      // Aquí colocas la lógica para enviar la comanda
      const response = await dispatch(asyncOrder(order));

      // Actualizar el estado para indicar que la orden se envió correctamente
      setStatusOrder(3);

      // Redirigir al usuario a WhatsApp si la comanda se envió correctamente
      window.open(whatsappLink, "_blank");

      console.log("Comanda enviada correctamente:", response);
    } catch (error) {
      console.error("Error al enviar la comanda:", error);
      // Actualizar el estado para indicar que hubo un error al enviar la orden
      setStatusOrder(2);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleClickOpen} className="btnWssp low">
          Enviar Pedido
        </button>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        style={{
          zIndex: 9999,
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        }}
      >
        <DialogTitle className="infoNavi">
          <div>
            <img  src={`${API}${comercio?.attributes?.logo?.data?.attributes?.url}`}alt="logo" width="100px" />
          </div>
          <div style={{ marginLeft: "30%" }}>
            <button className="exit" onClick={handleClose}>
              x
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-slide-description">
            Genial, estas a un paso de finalizar tu pedido.
            <br />
            Ayúdanos a tener una mejor atención:
            <form className="formPedido">
              <div className="boxPedido">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  className={`telefono-input selectP ${
                    /^\d{10}$/.test(order?.telefono) ? "" : "redX"
                  }`}
                  type="tel"
                  id="telefono"
                  name="telefono"
                  maxLength="10"
                  value={order?.telefono}
                  onChange={handleOrder}
                  placeholder="Ingresar telefono"
                />
                {order.telefono && /^\d{10}$/.test(order.telefono) ? (
                  <p className="valid-message">✔️</p>
                ) : null}
                {order.telefono && /^\d{10}$/.test(order.telefono)
                  ? null
                  : order.telefono &&
                    order.telefono !== "291" && (
                      <p className="error-message">
                        Por favor, ingrese un número de teléfono válido.
                      </p>
                    )}
                <label htmlFor="name">Nombre Completo:</label>
                <input
                  className={`telefono-input selectP ${
                    order.name.length > 3 ? "" : "redX"
                  }`}
                  type="text"
                  id="name"
                  name="name"
                  max="10"
                  value={order?.name}
                  onChange={handleOrder}
                  placeholder="name de quien retira"
                />
                <select
                  className="selectP"
                  name="metodo_de_pago"
                  onChange={handleOrder}
                  value={order?.metodo_de_pago}
                >
                  <option hidden disabled defaultValue value={""}>
                    Como pagas?
                  </option>
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>QR</option>
                </select>
                <select
                  className="selectP"
                  name="tipo_pedido"
                  onChange={handleOrder}
                  value={order?.tipo_pedido}
                >
                  <option hidden disabled defaultValue value={""}>
                    Delivery o Take Away?
                  </option>
                  <option>Delivery</option>
                  <option>Take Away</option>
                </select>
                <div
                  style={{
                    display:
                      order?.tipo_pedido === "Delivery" ? "flex" : "none",
                    flexDirection: "column",
                  }}
                >
                  <label htmlFor="domicilio">Domicilio:</label>
                  <input
                    className={`telefono-input selectP ${
                      order?.tipo_pedido === "Delivery" &&
                      order?.domicilio?.length > 7
                        ? ""
                        : "redX"
                    }`}
                    type="text"
                    id="domicilio"
                    name="domicilio"
                    max="20"
                    value={order?.domicilio}
                    onChange={handleOrder}
                    placeholder="Domicilio para la entrega"
                  />
                </div>

                {statusOrder === 1 ? (
                  <button
                    className="btnWssp"
                    onClick={sendComanda}
                    type="button"
                    target="_blank"
                  >
                    Enviar Pedido
                  </button>
                ) : statusOrder === 2 ? (
                  <div>
                    <button
                      className="btnWssp"
                      onClick={sendComanda}
                      type="button"
                      target="_blank"
                    >
                      Enviar Pedido
                    </button>
                  
                    <div style={{display:"flex", alignItems:"center"}}>
                    ✔️
                   <p className="orderFail">
                      Por algún motivo no es posible realizar el pedido.
                    </p>
                    ✔️
                  </div>
                  </div>
                ) : statusOrder === 3 ? (
                  <div style={{display:"flex", alignItems:"center"}}>
                    ✔️
                    <p className="orderExito">
                     Tu pedido fue realizado con éxito 
                    </p>
                    ✔️
                  </div>
                ) : null}

                {!(
                  /^\d{10}$/.test(order?.telefono) &&
                  order?.name?.length > 3 &&
                  (order?.tipo_pedido === "Take Away" ||
                    (order?.tipo_pedido === "Delivery" &&
                      order.domicilio.length > 7)) &&
                  order?.metodo_de_pago &&
                  order?.total_pedido
                ) && (
                  <ul style={{ color: "red", marginTop: "10px" }}>
                    {!(order.name.length > 3) && (
                      <li className="liError">
                        Ingrese un name válido (más de 3 caracteres).
                      </li>
                    )}
                    {!(
                      order?.tipo_pedido === "Take Away" ||
                      (order?.tipo_pedido === "Delivery" &&
                        order?.domicilio?.length > 7)
                    ) && (
                      <li className="liError">
                        Seleccione una opción válida para el tipo de pedido y,
                        si es Delivery, ingrese una dirección válida.
                      </li>
                    )}
                    {!order.metodo_de_pago && (
                      <li className="liError">Seleccione una forma de pago.</li>
                    )}
                    {!order.total_pedido && (
                      <li className="liError">
                        El total del pedido no puede estar vacío.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions> </DialogActions>
      </Dialog>
    </div>
  );
}
