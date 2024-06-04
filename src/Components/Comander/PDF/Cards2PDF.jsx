import React from "react";
// import { Card } from "./Card/Card";

import "../../Cards/Cards.css";
import { useSelector } from "react-redux";
import { CardPDF } from "./CardPDF";

export const Cards2PDF = ({ products }) => {
 

  const processedName = products?.attributes?.name
    .split(/\(([^)]+)\)/)
    .map((part) => part?.split(/\[.*?\]/)) // Dividir por corchetes []
    .flat() // Aplanar el array
    .map((part) => part?.trim())
    .filter((part) => part !== ""); // Eliminar elementos vacíos después de la división

  return (
    <>
      {products?.attributes?.articulos?.data?.length !== 0 ? (
        <div className="carta">
          <h2 className="titleSection">{processedName}</h2>
          <div className="rowsCard">
            {/* {subCat?.map((producto) => (
              <CardPDF producto={producto} />
            ))} */}
          </div>
        </div>
      ) : null}
    </>
  );
};
