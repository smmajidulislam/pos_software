import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const handlePrint = (salesDetailsRef) => {
  const printContent = salesDetailsRef.current;
  const WindowPrt = window.open("", "", "width=900,height=650");
  WindowPrt.document.write(`
    <html>
      <head>
        <title>Sales Detail</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
};

const handleDownloadPDF = (salesDetailsRef) => {
  const element = salesDetailsRef.current;
  html2pdf().from(element).save("sales-details.pdf");
};

const handleDownloadExcel = (selectedOrder) => {
  const data = selectedOrder?.products?.map((product) => ({
    Product: product.productName,
    Quantity: product.quantity,
    Code: product.itemCode,
    Discount: product.discountAmount,
    Tax: product.taxAmount,
    Total: product.totalPrice,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Details");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(blob, "sales-details.xlsx");
};

export { handlePrint, handleDownloadPDF, handleDownloadExcel };
