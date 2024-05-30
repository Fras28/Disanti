import React, { useState, useEffect } from "react";
import Dashboard from "./DashBoard/DashBoard";
import ComandasComponent from "./General/Comander";
import ModalGen from "../Modal/ModalConfirmacion/Modal";
import { Editer } from "../Categorias/Editer";
import { useDispatch, useSelector } from "react-redux";
import LoginComponent from "./LogIn/LogIn";
import { asyncAllProducts, asyncAllSubCategoria, asyncProductComander } from "../redux/slice";
import PdfGeneratos from "./PDF/pdf";
import QRCodeGenerator from "./QrGen/QrGeneratos";
import "./AdminPanel.css";
import { EditerSub } from "../Categorias/EditerSub";

const API = process.env.REACT_APP_API_STRAPI;

// Función para detectar si es un dispositivo móvil
// const isMobileDevice = () => {
//   return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(window.navigator.userAgent);
// };

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const [panel, setPanel] = useState("General");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { usuarioComander, comercio, subCategorias, allProduct } = useSelector((state) => state.alldata);

  useEffect(() => {
    dispatch(asyncAllSubCategoria());
    dispatch(asyncAllProducts());
    // if (!isMobileDevice()) {
      dispatch(asyncProductComander());
    // }
  }, [usuarioComander]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {usuarioComander ? (
        <div>
          <div className="admCont">
            <img
              src={`${API}${comercio?.attributes?.logo?.data?.attributes?.url}`}
              alt=""
              className="logoCel"
            />
            <button
              className="generic buttonDash AdminBtns"
              onClick={() => setPanel("General")}
            >
              General
            </button>
            <button
              className="generic buttonDash AdminBtns"
              /*onClick={() => setPanel("Estadisticas")}*/
            >
              Estadisticas
            </button>
            <div className="dropdown">
              <button
                className="generic buttonDash AdminBtns"
                onClick={toggleDropdown}
              >
                Editar
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <ModalGen Child={<Editer />} txtBtn="Edit Articulos" />
                  <ModalGen Child={<EditerSub />} txtBtn="Editar Sub Categorias" />
                  {/* <ModalGen Child={<Editer />} txtBtn="Editar Categorias" /> */}
                </div>
              )}
            </div>
            <ModalGen Child={<PdfGeneratos />} txtBtn="PDF Carta" />
            <ModalGen Child={<QRCodeGenerator />} txtBtn="Generar QRS" />
          </div>

          {/* Aquí puedes renderizar el panel según el estado "panel" */}
          {panel === "General" && <ComandasComponent />}
          {panel === "Estadisticas" && <Dashboard />}
          {panel === "Otros" && <Dashboard />}
        </div>
      ) : (
        <LoginComponent />
      )}
    </>
  );
};
