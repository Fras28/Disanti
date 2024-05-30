import React from "react";
import { Card } from "./Card/Card";

import "./Cards.css";
import { CardEdite } from "./Card/CardEdit";
import { CardEditeSub } from "./Card/CardEditSub";

export const CardsEditSub = ({ sub }) => {
  return (
    <div className="cartaEdit" >
      <div className="rowsCardEdit">
        {sub?.map((e, index) => (
          <CardEditeSub key={index} producto={e} />
        ))}
      </div>
    </div>
  );
};


