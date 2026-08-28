// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const studyModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "አንተ የጥናት ረዳት ነህ። ተማሪዎች ፒዲኤፍ ሲሰጡህ፣ ዋና ዋና ነጥቦችን አውጣ፣ ፍላሽ ካርዶችን አዘጋጅ እና ግልጽ ያልሆኑ ነገሮችን በዝርዝር አስረዳ። ከጥናት ውጭ ለሆኑ ጥያቄዎች አትመልስ።",
});