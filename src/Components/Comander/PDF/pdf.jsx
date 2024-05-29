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

  const generarPDF = () => {
    const quality = 'high'; // Configurar la calidad de impresión a alta
    const doc = new jsPDF('landscape', 'mm', 'a4', true, quality); // Reemplaza 'pageSize' por 'a4'
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Add full-page image as the cover
    const imgData = Fondo; // Replace with your image base64 data or URL
    doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  
    // Add new page for the content
    doc.addPage();
  
    const margin = 10;
    const lineHeight = 5;
    const halfLineHeight = lineHeight / 2;
    const columnWidth = (pageWidth - 3 * margin) / 2;
    let currentPage = 2; // Start from the second page for content
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
      let height = lineHeight; // For subcategory title
      subCat?.attributes?.articulos?.data?.forEach((articulo) => {
        height += halfLineHeight; // For each article title with reduced spacing
        if (articulo?.attributes?.detail) {
          const detalleLines = doc.splitTextToSize(articulo?.attributes?.detail, columnWidth - 40);
          height += detalleLines.length * halfLineHeight;
        }
        height += halfLineHeight; // For spacing
      });
      return height;
    };
  
    const calculateCategoryHeight = (prod) => {
      let height = lineHeight + 10; // For category title
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
  
      // Verificar si hay espacio suficiente en la columna actual para la categoría y al menos una subcategoría
      if (currentY + categoryHeight > doc.internal.pageSize.height - margin) {
        switchColumn();
      }
  
      // Añadir categoría
      textLines.forEach((line) => {
        const x = margin + currentColumn * (columnWidth + margin);
        const lineWidth = doc.getTextWidth(line);
        const textXStart = x + (columnWidth - lineWidth) / 2; // Centrar el texto en la columna
        const textY = currentY + lineHeight;
  
        // Dibujar el texto de la categoría centrado
        doc.text(line, textXStart, textY);
        
        const lineXStart = x; // Comienzo de la línea en el borde izquierdo de la columna
        const lineXEnd = x + columnWidth; // Fin de la línea en el borde derecho de la columna
        const lineY = currentY + lineHeight + 1;
  
        // Verificar si la línea excede los límites de la página
        if (lineXStart < margin || lineXEnd > doc.internal.pageSize.width - margin) {
          // Si la línea se extiende fuera de los límites de la página, ajustar sus extremos
          const adjustedLineXStart = Math.max(lineXStart, margin);
          const adjustedLineXEnd = Math.min(lineXEnd, doc.internal.pageSize.width - margin);
          doc.setDrawColor(55, 90, 57);
          doc.setLineWidth(0.5);
          doc.line(adjustedLineXStart, lineY, adjustedLineXEnd, lineY);
        } else {
          // Si la línea está dentro de los límites de la página, dibujarla normalmente
          doc.setDrawColor(55, 90, 57);
          doc.setLineWidth(0.5);
          doc.line(lineXStart, lineY, lineXEnd, lineY);
        }
        
        currentY += lineHeight + 10;
      });
  
      // Añadir subcategorías y artículos
      prod?.attributes?.sub_categorias?.data.forEach((subCat) => {
        const subCategoryName = subCat?.attributes?.name.replace(/\[[^\]]*\]/g, '');
  
        const subText = `\t -${subCategoryName}-\n`;
  
        const subTextLines = doc.splitTextToSize(subText, columnWidth);
  
        const subCategoryHeight = calculateSubCategoryHeight(subCat);
  
        // Verificar si hay espacio suficiente en la columna actual para la subcategoría y sus artículos
        if (currentY + subCategoryHeight > doc.internal.pageSize.height - margin) {
          switchColumn();
          // Si no hay suficiente espacio en la nueva columna, agregar una nueva página
          if (currentY + subCategoryHeight > doc.internal.pageSize.height - margin) {
            addNewPage();
          }
        }
  
        // Añadir subcategoría
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        subTextLines.forEach((line) => {
          const x = margin + currentColumn * (columnWidth + margin);
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
  
        // Añadir artículos
        subCat?.attributes?.articulos?.data.forEach((articulo) => {
          const nombreArticulo = articulo?.attributes?.name.padEnd(30, ".");
          const precioArticulo = `$${articulo?.attributes?.price}`.padStart(10, ".");
  
          // Agregar nombreArticulo y precioArticulo en negrita
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          let articuloText = `\t\t${nombreArticulo}  ${precioArticulo}`;
  
          // Restablecer la fuente para los detalles
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
              // Si no hay suficiente espacio en la nueva columna, agregar una nueva página
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
