import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import PDFParser from 'pdf2json'; // To parse the pdf
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileName = uuidv4();
    const tempFilePath = `/tmp/${fileName}.pdf`;

    // Convertir le fichier en buffer et le sauvegarder
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Créer une promesse pour gérer l'extraction du texte de manière asynchrone
    const parsedText = await new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('Erreur de parsing PDF:', errData.parserError);
        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', () => {
        const text = (pdfParser as any).getRawTextContent();
        resolve(text);
      });

      pdfParser.loadPDF(tempFilePath);
    });

    // Nettoyer le fichier temporaire
    await fs.unlink(tempFilePath);

    return NextResponse.json({ text: parsedText });

  } catch (error) {
    console.error("Erreur lors du traitement du PDF:", error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du PDF' },
      { status: 500 }
    );
  }
}