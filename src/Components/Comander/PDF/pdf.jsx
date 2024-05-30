import React, { useState } from "react";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import "./pdf.css";
import Fondo from "../../assets/PortadaPDF.jpg"

const PdfGeneratos = () => {
  const { productCom, } = useSelector((state) => state.alldata);
  const [pageSize, setPageSize] = useState('a4');

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  };

  const generarPDF = async () => {
    const quality = 'high';
    const doc = new jsPDF('landscape', 'mm', 'a4', true, quality);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
      const img = await loadImage(Fondo);
      doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
    } catch (err) {
      console.error("Error loading image", err);
    }

    doc.addPage();
  
    const margin = 10;
    const lineHeight = 5;
    const halfLineHeight = lineHeight / 2;
    const columnWidth = (pageWidth - 3 * margin) / 2;
    let currentPage = 2;
    let currentY = margin;
    let currentColumn = 0;
  
    const addNewPage = () => {
      doc.addPage();
      currentPage++;
      currentY = margin;
      currentColumn = 0;
    };
  
    const switchColumn = () => {
      if (currentColumn === 0) {
        currentColumn = 1;
        currentY = margin;
      } else {
        addNewPage();
      }
    };
  
    const calculateSubCategoryHeight = (subCat) => {
      let height = lineHeight;
      subCat?.attributes?.articulos?.data?.forEach((articulo) => {
        height += halfLineHeight;
        if (articulo?.attributes?.detail) {
          const detalleLines = doc.splitTextToSize(articulo?.attributes?.detail, columnWidth - 40);
          height += detalleLines.length * halfLineHeight;
        }
        height += halfLineHeight;
      });
      return height;
    };
  
    const calculateCategoryHeight = (prod) => {
      let height = lineHeight + 10;
      if (prod?.attributes?.sub_categorias?.data?.length > 0) {
        height += calculateSubCategoryHeight(prod.attributes.sub_categorias.data[0]);
      }
      return height;
    };
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    currentY += lineHeight + 5;
  
    productCom?.forEach((prod, index) => {
      const categoryName = prod?.attributes?.name.replace(/\[[^\]]*\]/g, '');
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 90, 57);
  
      let text = `${index + 1}. ${categoryName}`;
      const textLines = doc.splitTextToSize(text, columnWidth);
  
      const categoryHeight = calculateCategoryHeight(prod);
  
      if (currentY + categoryHeight > doc.internal.pageSize.height - margin) {
        switchColumn();
      }
  
      textLines.forEach((line) => {
        const x = margin + currentColumn * (columnWidth + margin);
        const lineWidth = doc.getTextWidth(line);
        const textXStart = x + (columnWidth - lineWidth) / 2;
        const textY = currentY + lineHeight;
  
        doc.text(line, textXStart, textY);
        
        const lineXStart = x;
        const lineXEnd = x + columnWidth;
        const lineY = currentY + lineHeight + 1;
  
        if (lineXStart < margin || lineXEnd > doc.internal.pageSize.width - margin) {
          const adjustedLineXStart = Math.max(lineXStart, margin);
          const adjustedLineXEnd = Math.min(lineXEnd, doc.internal.pageSize.width - margin);
          doc.setDrawColor(55, 90, 57);
          doc.setLineWidth(0.5);
          doc.line(adjustedLineXStart, lineY, adjustedLineXEnd, lineY);
        } else {
          doc.setDrawColor(55, 90, 57);
          doc.setLineWidth(0.5);
          doc.line(lineXStart, lineY, lineXEnd, lineY);
        }
        
        currentY += lineHeight + 10;
      });
  
      prod?.attributes?.sub_categorias?.data.forEach((subCat) => {
        const subCategoryName = subCat?.attributes?.name.replace(/\[[^\]]*\]/g, '');
  
        const subText = `\t -${subCategoryName}-\n`;
  
        const subTextLines = doc.splitTextToSize(subText, columnWidth);
  
        const subCategoryHeight = calculateSubCategoryHeight(subCat);
  
        if (currentY + subCategoryHeight > doc.internal.pageSize.height - margin) {
          switchColumn();
          if (currentY + subCategoryHeight > doc.internal.pageSize.height - margin) {
            addNewPage();
          }
        }
  
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        subTextLines.forEach((line) => {
          const x = margin + currentColumn * (columnWidth + margin);
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
  
        subCat?.attributes?.articulos?.data.forEach((articulo) => {
          const nombreArticulo = articulo?.attributes?.name.padEnd(30, ".");
          const precioArticulo = `$${articulo?.attributes?.price}`.padStart(10, ".");
  
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          let articuloText = `\t\t${nombreArticulo}  ${precioArticulo}`;
  
          doc.setFont("helvetica", "normal");
  
          if (articulo?.attributes?.detail) {
            const detalleLines = doc.splitTextToSize(articulo?.attributes?.detail, columnWidth - 40);
            doc.setFontSize(8);
            detalleLines.forEach((line) => {
              articuloText += `\n\t\t${line}`;
            });
            articuloText += "\n\n";
            doc.setFontSize(10);
          } else {
            articuloText += "\n\n";
          }
  
          const articuloTextLines = doc.splitTextToSize(articuloText, columnWidth);
          articuloTextLines.forEach((line) => {
            if (currentY + halfLineHeight > doc.internal.pageSize.height - margin) {
              switchColumn();
              if (currentY + halfLineHeight > doc.internal.pageSize.height - margin) {
                addNewPage();
              }
            }
            const x = margin + currentColumn * (columnWidth + margin);
            doc.text(line, x, currentY);
            currentY += halfLineHeight;
          });
        });
  
        currentY += halfLineHeight;
      });
  
      currentY += lineHeight;
    });
  
    doc.save(`mi_carta_pagina_${currentPage}.pdf`);
  };

  return (
    <div>
      <h1>Mi Carta Digital</h1>
      <div>
        <label htmlFor="pageSize">Selecciona el tamaño de la hoja: </label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
          <option value="a4">A4</option>
          <option value="a3">A3</option>
          <option value="a2">A2</option>
        </select>
      </div>
      <button onClick={generarPDF}>Descargar PDF</button>
    </div>
  );
};

export default PdfGeneratos;
