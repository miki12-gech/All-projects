-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_lessonId_fkey";

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
