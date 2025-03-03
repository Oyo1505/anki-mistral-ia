
import worker from "@/lib/tesseract";


const extractTextFromImage = async (img: string) => {

  const ret = await worker.recognize(img);
  const text = ret.data.text;
  await worker.terminate();
  return text;
};

export default extractTextFromImage;