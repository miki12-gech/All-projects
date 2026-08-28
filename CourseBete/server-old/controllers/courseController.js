const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllCourses = async (req, res) => {
    try {
        console.log("--- DEBUG: Fetching Courses ---");
        
       
        const userId = req.user ? req.user.userId : -1;

        
        const courses = await prisma.course.findMany({
            include: {
                lessons: {
                    include: {
                       
                        quizResults: {
                            where: { userId: userId, passed: true }
                        }
                    }
                }
            }
        });

      
        const coursesWithProgress = courses.map(course => {
            const totalLessons = course.lessons.length;
            
         
            const completedLessons = course.lessons.filter(
                lesson => lesson.quizResults.length > 0
            ).length;
            
            const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                thumbnailUrl: course.thumbnailUrl,
                lessonCount: totalLessons,
                progress: progress
            };
        });

        res.json(coursesWithProgress);

    } catch (error) {
        console.error("!!! CRASH IN GET COURSES !!!");
        console.error(error); 
        res.status(500).json({ error: "Server crashed while fetching courses" });
    }
};


exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: { 
                lessons: {
                    orderBy: { order: 'asc' }
                } 
            }
        });
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch course" });
    }
};


exports.createCourse = async (req, res) => {
    try {
        const { title, description, thumbnailUrl } = req.body;
        const newCourse = await prisma.course.create({
            data: { 
                title, 
                description, 
                thumbnailUrl: thumbnailUrl || "https://via.placeholder.com/300" 
            }
        });
        res.json(newCourse);
    } catch (error) {
        res.status(500).json({ error: "Could not create course" });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        
        await prisma.course.delete({
            where: { id: parseInt(id) }
        });
        
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error); 
        res.status(500).json({ error: "Failed to delete course" });
    }
};



exports.addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, videoUrl, contentText, order, questions } = req.body;

        const newLesson = await prisma.lesson.create({
            data: {
                title,
                videoUrl,
                contentText,
                order: parseInt(order),
                courseId: parseInt(courseId),
               
                questions: {
                    create: questions.map(q => ({
                        questionText: q.questionText,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation
                    }))
                }
            }
        });

        res.json(newLesson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add lesson" });
    }
};
