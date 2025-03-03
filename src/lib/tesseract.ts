import { createWorker } from "tesseract.js";

const worker = await createWorker("jpn+fra");

export default worker;
