
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seed...');

  
  await prisma.quizResult.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('🧹 Old data cleaned.');

 
  await prisma.course.create({
    data: {
      title: 'Geez for Beginners',
      description: 'Learn the ancient language of the Ethiopian Orthodox Church from scratch.',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ge%27ez_script.svg/1200px-Ge%27ez_script.svg.png',
      lessons: {
        create: [
      
          { 
            title: 'The Alphabet (Fidel)', 
            contentText: 'The Geez writing system is an abugida... Ha, Hu, Hi, Ha, Hie, Hih, Ho.', 
            order: 1,
            videoUrl: "https://www.youtube.com/watch?v=S080dI32jM4",
            questions: {
                create: [
                    { 
                        questionText: "What is the first letter of the Geez alphabet?", 
                        options: ["Ha", "La", "Ma", "Sa"], 
                        correctAnswer: 0,
                        explanation: "The first letter is always 'Ha' (ሀ)."
                    },
                    { 
                        questionText: "How many forms/variations does each letter have?", 
                        options: ["5", "7", "10", "3"], 
                        correctAnswer: 1,
                        explanation: "Each letter has 7 forms: Ge'ez, Ka'eb, Salis, Rabe, Hamis, Sadis, Sabe."
                    },
                    { 
                        questionText: "Which direction is Geez written in?", 
                        options: ["Right to Left", "Left to Right", "Top to Bottom", "It varies"], 
                        correctAnswer: 1,
                        explanation: "Unlike Arabic or Hebrew, Geez is written from Left to Right, just like English."
                    }
                ]
            }
          },
         
          { 
            title: 'Basic Grammar & Greetings', 
            contentText: 'Learning how to say Hello (Selam) and Father (Ab).', 
            order: 2,
            questions: {
                create: [
                    { 
                        questionText: "How do you say 'Father' in Geez?", 
                        options: ["Ab", "Emet", "Bet", "Nigus"], 
                        correctAnswer: 0,
                        explanation: "'Ab' means Father. 'Emet' means Mother. 'Bet' means House."
                    },
                    { 
                        questionText: "Is Geez still a spoken daily language?", 
                        options: ["Yes, everywhere", "No, it is liturgical (Church only)", "Yes, in schools only", "No, it is extinct"], 
                        correctAnswer: 1,
                        explanation: "Geez is primarily a liturgical language used in the Orthodox Church, similar to Latin in the West."
                    }
                ]
            }
          }
        ],
      },
    },
  });

 
  await prisma.course.create({
    data: {
      title: 'Old Testament History',
      description: 'A deep dive into Genesis, Exodus, and the Prophets.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65',
      lessons: {
        create: [
        
          { 
            title: 'Creation (Genesis 1)', 
            contentText: 'In the beginning God created the heavens and the earth...', 
            order: 1,
            videoUrl: "https://www.youtube.com/watch?v=teu7BCZTgDs",
            questions: {
                create: [
                    { 
                        questionText: "What did God create on Day 1?", 
                        options: ["Animals", "Light", "The Sun", "Man"], 
                        correctAnswer: 1,
                        explanation: "On Day 1, God said 'Let there be Light'. The Sun was actually created on Day 4!"
                    },
                    { 
                        questionText: "How many days did the creation process take?", 
                        options: ["3 Days", "10 Days", "6 Days", "7 Days"], 
                        correctAnswer: 2,
                        explanation: "God worked for 6 days and rested on the 7th day (Sabbath)."
                    }
                ]
            }
          }
        ],
      },
    },
  });

  console.log('✅ All Courses, Lessons, and Interactive Quizzes Populated!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });