package com.coursebete.controller;

import com.coursebete.model.Question;
import com.coursebete.model.QuizResult;
import com.coursebete.repository.QuestionRepository;
import com.coursebete.repository.QuizResultRepository;
import com.coursebete.repository.UserRepository;
import com.coursebete.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{lessonId}")
    public List<Question> getQuiz(@PathVariable Long lessonId) {
        return questionRepository.findByLessonId(lessonId);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> payload) {
        Long lessonId = ((Number) payload.get("lessonId")).longValue();
        Map<String, Integer> userAnswers = (Map<String, Integer>) payload.get("userAnswers");
        
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        List<Question> questions = questionRepository.findByLessonId(lessonId);
        
        int score = 0;
        for (Question q : questions) {
            // Need to handle potential type mismatch if key is String but ID is Long
            // The logic in JS Node: userAnswers[q.id] === q.correctAnswer
            // In Java Payload it is Map<String, Integer>. Keys are question IDs as String?
            // Let's assume keys are String representation of IDs.
            if (userAnswers.containsKey(q.getId().toString()) && 
                userAnswers.get(q.getId().toString()).equals(q.getCorrectAnswer())) {
                score++;
            }
        }

        boolean passed = (double) score / questions.size() >= 0.5;

        QuizResult quizResult = new QuizResult();
        quizResult.setUser(userRepository.findById(userId).get());
        // Need to fetch Lesson proxy or entity
        // For simplicity assuming Lesson exists and just setting ID if possible, but JPA needs entity.
        // I'll cheat and fetch a dummy reference or just let it fail if not found (would need LessonRepository).
        // Let's inject LessonRepository to be safe, or just find any question's lesson
        if (!questions.isEmpty()) {
            quizResult.setLesson(questions.get(0).getLesson());
        } else {
             // Handle case with no questions? user shouldn't submit empty quiz
             return ResponseEntity.badRequest().body("No questions in this quiz");
        }
        
        quizResult.setScore(((double) score / questions.size()) * 100);
        quizResult.setPassed(passed);
        
        quizResultRepository.save(quizResult);

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("total", questions.size());
        response.put("passed", passed);
        response.put("message", passed ? "Passed!" : "Try Again");

        return ResponseEntity.ok(response);
    }
}
