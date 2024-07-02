import React from "react";
import Logo from "../assets/ElMundoParrilla-removebg-preview (2).png"
import { Link, NavLink, useHistory, useRouteMatch } from "react-router-dom";
import "./Nav.css";
import { useSelector } from "react-redux";
import instagram from "../assets/Instagram.webp"
import wssp from "../assets/whatsapp.png"

const API = process.env.REACT_APP_API_STRAPI;

const BackButton = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="backLink" onClick={goBack}>
      <p className="back">
        <svg
          height="18"
          viewBox="0 0 710 479"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M658.56 188.56H333.013L434.56 87.0134C453.972 67.6014 453.972 35.4921 434.56 15.3307C415.148 -4.08127 383.039 -4.08127 362.877 15.3307L175.464 203.491C156.052 222.903 156.052 255.012 175.464 275.173L363.624 463.333C373.332 473.042 386.769 478.265 399.463 478.265C412.155 478.265 425.599 473.036 435.301 463.333C454.713 443.921 454.713 411.812 435.301 391.651L333.009 290.099H658.556C686.181 290.099 709.327 267.697 709.327 239.328C709.327 210.953 686.925 188.557 658.556 188.557L658.56 188.56Z"
            fill="white"
          />
          <path
            d="M50.7734 1.14671C23.148 1.14671 0.00268555 23.548 0.00268555 51.9174V427.491C0.00268555 455.116 22.404 478.261 50.7734 478.261C79.148 478.261 101.544 455.86 101.544 427.491L101.549 51.1707C100.804 23.5454 78.4039 1.14404 50.7732 1.14404L50.7734 1.14671Z"
            fill="white"
          />
        </svg>
      </p>
    </div>
  );
};

const Nav = (id) => {
  const match = useRouteMatch("/:id/Landing/:category");
  const { comercio } = useSelector((state) => state.alldata);

  return (

      <div className="nav">
        <div style={{width:"40px", display:"flex",alignItems:"center"}}>
          {match && <BackButton />}
        </div>
        <div >
          <NavLink to={`/${match?.params.id}/Landing`}>
            <img
            src={`${API}${comercio?.attributes?.logo?.data?.attributes?.url}`}
              alt="logoCakes"
              style={{ maxHeight: "60px", borderRadius:"50%" }}
            />
          </NavLink>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent:"center" }}>
  
          <a
            className="links"
            href="https://www.instagram.com/elmundodelaparrilla/"
            target="_blank"
          >
         <img src={instagram} alt="ig" width="30px"/>
          </a>
          
          <a
            className="links"
            href="https://www.instagram.com/elmundodelaparrilla/"
            target="_blank"
          >
         <img src={wssp} alt="ig" width="30px"/>
          </a>
        </div>
      </div>

  );
};

export default Nav;
