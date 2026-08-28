export const negereBeteKristiyanHaw = {
  id: "negere_bete_kristiyan_haw",
  title: "ነገረ ቤተ ክርስቲያን (ጉባኤ ሐዋርያት)",
  description: "ስለ ቅዳሴ ሥርዓትና ምሥጢራተ ቤተ ክርስቲያን ጥልቅ ትምህርት",
  lessons: [
    {
      id: "les_haw_bete_1",
      title: "ቅዳሴ – የቤተ ክርስቲያን ማዕከል",
      content: `
        <p>ቅዳሴ ከሁሉ በላይ የሚበልጥ የአምልኮ ሥርዓት ነው። በዚህ ጊዜ እንጀራና ወይን በመንፈስ ቅዱስ ኃይል ወደ እውነተኛ ሥጋና ደም ይለወጣሉ። ይህ ምሥጢር ከፍተኛ ክብር ይገባዋል።</p>
        <p>የቅዳሴ መጽሐፍ ቅዱሳን ሊቃውንት እንደ ቅዱስ ባስልዮስ፣ ቅዱስ ያዕቆብና ቅዱስ ኪሪሎስ በመንፈስ ቅዱስ መሪነት አዘጋጅተውታል።</p>
      `,
      inlineExplanations: [
        {
          id: "exp_haw_bete_1",
          quotedText: "እንጀራና ወይን ወደ እውነተኛ ሥጋና ደም ይለወጣሉ",
          explanation: "<p>ይህ ትምህርት በቤተ ክርስቲያን እምነት መሠረት በኅብረት ሥርዓት ጊዜ ቁስ አካል አይቀርም፤ ነገር ግን በእውነት የክርስቶስ ሥጋና ደም ይሆናል። ይህ ምሥጢር በእምነት ብቻ መረዳት ይቻላል።</p>",
        },
      ],
    },
    {
      id: "les_haw_bete_2",
      title: "የቤተ ክርስቲያን ምሥጢራት (ቅዱሳት ምሥጢራት)",
      content: `
        <p>ቤተ ክርስቲያን ሰባት ቅዱሳት ምሥጢራት ታስተምራለች፦ ጥምቀት፣ መምህረ ምሥጢር (ቅዳሴ)፣ ጸሎተ ቅዳሴ (ክህነት)፣ ንስሐ፣ ቅባት ጥንቁቅ፣ ዘይት ቅዳሴ (ዕጣን ዘይት)፣ ሥርዓተ ጋብቻ። እያንዳንዱ ምሥጢር የራሱ መለኮታዊ ጸጋ አለው።</p>
      `,
      inlineExplanations: [],
    },
    // Add more lessons as needed
  ],
  exam: {
    id: "exam_haw_bete",
    questions: [
      {
        id: "q_haw_bete_1",
        text: "ቅዳሴ ወቅት እንጀራና ወይን ወደ ምን ይለወጣሉ?",
        options: ["ምልክት", "ሥጋና ደም እውነተኛ", "ተራ ምግብ", "ጣኦት"],
        correctAnswer: "ሥጋና ደም እውነተኛ",
        points: 10,
      },
      {
        id: "q_haw_bete_2",
        text: "ከሚከተሉት ውስጥ አንዱ የቤተ ክርስቲያን ምሥጢር አይደለም?",
        options: ["ጥምቀት", "ንስሐ", "ጋብቻ", "ዘመን ማስቆጠር"],
        correctAnswer: "ዘመን ማስቆጠር",
        points: 10,
      },
    ],
    passingScore: 70,
  },
};