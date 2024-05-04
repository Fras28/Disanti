import React from "react";
import { Card } from "./Card/Card";

import "./Cards.css";
import { CardEdite } from "./Card/CardEdit";

export const CardsEdite = ({ products }) => {
  return (
    <div className="cartaEdit" >
      <div className="rowsCardEdit">
        {products?.map((e) => (
          <CardEdite producto={e} />
        ))}
      </div>
    </div>
  );
};


