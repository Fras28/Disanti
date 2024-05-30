import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Carousel = ({ logos }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Activar el autoplay
    autoplaySpeed: 3000, // Establecer la velocidad del autoplay en milisegundos (3 segundos en este caso)
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='noOverflow' >
      <h2 style={{ color: "white" }}>Nos Acompañan</h2>
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="logo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <a href={logo} target='_blank' className="logo-container" style={{display:"flex",justifyContent:"center"}}>
              <img src={logo} alt={`Cliente ${index + 1}`} height="100px" width="200px" style={{objectFit:"contain"}} />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
