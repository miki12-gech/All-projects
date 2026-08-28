export const negereAbawEccl = {
  id: "negere_abaw_eccl",
  title: "ነገረ አበው (ጉባኤ ኤቅሌስያ)",
  description: "ስለ ቅዱሳን አበው ትምህርት፣ ጻድቃን እና መናፍቃን መለየት",
  lessons: [
    {
      id: "les_eccl_abaw_1",
      title: "የአበው ሚና በምክር ቤቶች",
      content: `
        <p>ቅዱሳን አበው በመጀመሪያዎቹ ሰባት ምክር ቤቶች ትልቅ ሚና ነበራቸው። እንደ ቅዱስ አትናቴዎስ (እስክንድርያ)፣ ቅዱስ ባስልዮስ ታላቁ፣ ቅዱስ ግርጎርዮስ ዘናዝያንዞ የእምነት ጠባቂዎች ነበሩ።</p>
        <p>ምክር ቤተ ኒቅያ (325 ዓ.ም.) የአሪዮስን ክህደት አውግዟል። ምክር ቤተ ቁስጥንጥንያ (381 ዓ.ም.) የመንፈስ ቅዱስ መለኮት አረጋግጧል።</p>
      `,
      inlineExplanations: [
        {
          id: "exp_eccl_abaw_1",
          quotedText: "ምክር ቤተ ኒቅያ",
          explanation: "<p>በዚህ ምክር ቤት የኒቅያ እምነት ቃል ተቀርጾ ወልድ ከአብ ጋር እኩል መሆኑ ተረጋገጠ።</p>",
        },
      ],
    },
    {
      id: "les_eccl_abaw_2",
      title: "መናፍቃንን መለየት – ትምህርተ አበው",
      content: `
        <p>አበው እንደ አሪዮስ፣ አፖሊናሪዎስ፣ ኔስጦረስ፣ ኤውጢቄስ ያሉ መናፍቃን ትምህርት አጥብቀው ውድቅ አድርገዋል። የኦርቶዶክስ እምነት አንድነት ጠብቀዋል።</p>
        <p>ዛሬም ትምህርታቸው ለቤተ ክርስቲያን መመሪያ ነው።</p>
      `,
      inlineExplanations: [],
    },
    // More lessons can be added
  ],
  exam: {
    id: "exam_eccl_abaw",
    questions: [
      {
        id: "q_eccl_abaw_1",
        text: "የመጀመሪያው ምክር ቤት የት ነበር?",
        options: ["ቆስጠንጢኖስ", "ኒቅያ", "ኤፌሶን", "ሮም"],
        correctAnswer: "ኒቅያ",
        points: 10,
      },
      {
        id: "q_eccl_abaw_2",
        text: "አሪዮስ ማን ነበር?",
        options: ["ቅዱስ", "መናፍቅ", "ሃዋርያ", "ንጉሥ"],
        correctAnswer: "መናፍቅ",
        points: 10,
      },
    ],
    passingScore: 70,
  },
};