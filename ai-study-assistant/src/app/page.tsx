"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfText, setPdfText] = useState(""); 

  // ፒዲኤፍ ፋይልን ወደ ሰርቨር ልኮ ጽሁፍ የሚያወጣ ተግባር
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setPdfText(data.text);
        alert("ፒዲኤፉ በስኬት ተነቧል! አሁን ጥያቄ መጠየቅ ትችላለህ።");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      alert("ፒዲኤፉን ማንበብ አልተቻለም። እባክህ ፋይሉን አረጋግጥ።");
    } finally {
      setIsLoading(false);
    }
  };

  // ጥያቄውን እና የፒዲኤፉን ጽሁፍ (Context) ለ AI የሚልክ ተግባር
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setResponse(""); // አዲስ መልስ ከመምጣቱ በፊት የድሮውን ማጽዳት
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          context: pdfText 
        }),
      });

      const data = await res.json();
      if (data.message) {
        setResponse(data.message);
      } else {
        setResponse("AIው መልስ መስጠት አልቻለም።");
      }
    } catch (error) {
      setResponse("ስህተት ተፈጥሯል። እባክህ ቪፒኤን መብራቱን አረጋግጥ።");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 tracking-tight">AI Study Assistant</h1>
        
        {/* የፋይል መጫኛ ክፍል */}
        <div className="p-6 bg-white border-2 border-dashed border-blue-200 rounded-xl shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
             የጥናት ማቴሪያል (PDF) እዚህ ይጫኑ
          </label>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {pdfText && <p className="mt-3 text-green-600 text-sm font-bold flex items-center justify-center">✅ ፋይሉ ተዘጋጅቷል ({pdfText.length} ቃላት)</p>}
        </div>

        {/* ጥያቄ መጠየቂያ ፎርም */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows={4}
            placeholder={pdfText ? "ስለ ፒዲኤፉ ማንኛውንም ነገር ጠይቅ..." : "መጀመሪያ ፒዲኤፍ ጫን ወይም እዚህ ጥያቄ ጻፍ..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`py-3 px-6 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
            }`}
          >
            {isLoading ? "AI እያሰበ ነው..." : "ጠይቅ"}
          </button>
        </form>

        {/* የ AI መልስ ማሳያ */}
        {response && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg text-left text-black animate-in fade-in duration-500">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">የ AI መልስ፡</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}