const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const questions = await prisma.question.findMany({
            where: { lessonId: parseInt(lessonId) },
            
            select: {
                id: true,
                questionText: true,
                options: true,
                correctAnswer: true, 
                explanation: true    
            }
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: "Failed to load quiz" });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { lessonId, userAnswers } = req.body;
        const userId = req.user.userId; 

        const questions = await prisma.question.findMany({
            where: { lessonId: parseInt(lessonId) }
        });

        let score = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) score++;
        });

        const passed = (score / questions.length) >= 0.5;

        await prisma.quizResult.create({
            data: {
                userId,
                lessonId: parseInt(lessonId),
                score: (score / questions.length) * 100,
                passed
            }
        });

        res.json({ score, total: questions.length, passed, message: passed ? "Passed!" : "Try Again" });
    } catch (error) {
        res.status(500).json({ error: "Grading failed" });
    }
};