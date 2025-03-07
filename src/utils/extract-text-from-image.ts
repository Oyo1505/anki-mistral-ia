import { createWorker } from "tesseract.js";

const extractTextFromImage = async (img: string) => {
  const worker = await createWorker("jpn+fra");

  const ret = await worker.recognize(img);
  const text = ret.data.text;
  await worker.terminate();
  return text;
};

export default extractTextFromImage;