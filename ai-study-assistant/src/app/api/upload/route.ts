import { NextResponse } from "next/server";

// 1. ላይብረሪውን መጥራት
const pdf = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "ፋይል አልተገኘም" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 2. ስህተቱን የሚፈታው ወሳኝ ክፍል፡
    // pdf-parse አወቃቀሩ በስሪት ስለሚለያይ የትኛው ፈንክሽን እንደሆነ እንፈትሽ
    let parseFunc;
    if (typeof pdf === 'function') {
      parseFunc = pdf;
    } else if (pdf && typeof pdf.default === 'function') {
      parseFunc = pdf.default;
    } else {
      // አንዳንዴ በ Object ውስጥ በቀጥታ ሊቀመጥ ይችላል
      parseFunc = pdf; 
    }

    // 3. PDF ማንበብ
    const data = await parseFunc(buffer);

    console.log("✅ PDF ተነቧል!");
    return NextResponse.json({ text: data.text });

  } catch (error: any) {
    console.error("❌ PDF Parsing Error:", error.message);
    // ስህተቱ 'is not a function' ከሆነ ይህንን መልስ ይሰጣል
    return NextResponse.json({ error: "ፒዲኤፉን ማንበብ አልተቻለም፡ " + error.message }, { status: 500 });
  }
}