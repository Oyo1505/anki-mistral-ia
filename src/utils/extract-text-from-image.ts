
import { createWorker } from "tesseract.js";

const extractTextFromImage = async (img: string) => {
  console.log(img, "IMG");
  const worker = await createWorker("jpn+fra");
  const ret = await worker.recognize(img);
  const text = ret.data.text;
  await worker.terminate();
  return text;
};

export default extractTextFromImage;