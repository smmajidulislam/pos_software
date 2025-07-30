import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const handlePrint = (contentRef, title = "Print Preview") => {
  const content = contentRef.current;

  if (!content) return;

  const WindowPrt = window.open("", "", "width=900,height=650");
  WindowPrt.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
};

const handleDownloadPDF = (contentRef, fileName = "document.pdf") => {
  const element = contentRef.current;
  if (!element) return;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};

const handleDownloadExcel = ({
  data,
  fileName = "data.xlsx",
  sheetName = "Sheet1",
}) => {
  if (!data || !data.length) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(blob, fileName);
};

export { handlePrint, handleDownloadPDF, handleDownloadExcel };
