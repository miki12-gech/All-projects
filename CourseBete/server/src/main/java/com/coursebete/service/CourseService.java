package com.coursebete.service;

import com.coursebete.dto.request.LessonRequest;
import com.coursebete.dto.request.QuestionRequest;
import com.coursebete.dto.response.CourseResponse;
import com.coursebete.model.Course;
import com.coursebete.model.Lesson;
import com.coursebete.model.Question;
import com.coursebete.model.QuizResult;
import com.coursebete.repository.CourseRepository;
import com.coursebete.repository.LessonRepository;
import com.coursebete.repository.QuizResultRepository;
import com.coursebete.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizResultRepository quizResultRepository;

    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        List<CourseResponse> response = new ArrayList<>();

        Long userId = -1L;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            userId = ((UserDetailsImpl) principal).getId();
        }

        List<QuizResult> passedQuizzes = quizResultRepository.findByUserIdAndPassedTrue(userId);
        Set<Long> passedLessonIds = passedQuizzes.stream()
                .map(qr -> qr.getLesson().getId())
                .collect(Collectors.toSet());

        for (Course course : courses) {
            int totalLessons = course.getLessons() != null ? course.getLessons().size() : 0;
            int completedLessons = 0;
            
            if (course.getLessons() != null) {
                for (Lesson lesson : course.getLessons()) {
                    if (passedLessonIds.contains(lesson.getId())) {
                        completedLessons++;
                    }
                }
            }

            int progress = totalLessons == 0 ? 0 : Math.round(((float) completedLessons / totalLessons) * 100);

            response.add(new CourseResponse(
                    course.getId(),
                    course.getTitle(),
                    course.getDescription(),
                    course.getThumbnailUrl(),
                    totalLessons,
                    progress
            ));
        }

        return response;
    }
    
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @Transactional
    public Lesson addLesson(Long courseId, LessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setContentText(request.getContentText());
        lesson.setOrder(request.getOrder());
        lesson.setCourse(course);

        List<Question> questions = request.getQuestions().stream().map(qRequest -> {
            Question q = new Question();
            q.setQuestionText(qRequest.getQuestionText());
            q.setOptions(qRequest.getOptions());
            q.setCorrectAnswer(qRequest.getCorrectAnswer());
            q.setExplanation(qRequest.getExplanation());
            q.setLesson(lesson);
            return q;
        }).collect(Collectors.toList());

        lesson.setQuestions(questions);

        return lessonRepository.save(lesson);
    }
}
