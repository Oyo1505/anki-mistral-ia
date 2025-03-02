import PDFParser from 'pdf2json';

const extractTextFromPDF = async (filePath:string) => {
  return new Promise((resolve, reject) => {
    let pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", err => reject(err));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      let extractedText = pdfData.Pages.map(page =>
        page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n");
      resolve(extractedText);
    });

    pdfParser.loadPDF(filePath);
  });
};

export default extractTextFromPDF;
