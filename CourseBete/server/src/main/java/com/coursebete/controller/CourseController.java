package com.coursebete.controller;

import com.coursebete.dto.request.LessonRequest;
import com.coursebete.dto.response.CourseResponse;
import com.coursebete.model.Course;
import com.coursebete.model.Lesson;
import com.coursebete.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<CourseResponse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        // Simple mapping, normally DTO
        return courseService.createCourse(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        // Get current user from security context
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof com.coursebete.security.services.UserDetailsImpl) {
            com.coursebete.security.services.UserDetailsImpl currentUser = 
                (com.coursebete.security.services.UserDetailsImpl) authentication.getPrincipal();
            
            // Only superadmin can delete courses
            if (!"superadmin".equals(currentUser.getRole())) {
                return ResponseEntity
                    .status(403)
                    .body("Error: Only superadmin can delete courses!");
            }
        } else {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        courseService.deleteCourse(id);
        return ResponseEntity.ok().body("Course deleted successfully");
    }

    @PostMapping("/{courseId}/lessons")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long courseId, @RequestBody LessonRequest lessonRequest) {
        Lesson newLesson = courseService.addLesson(courseId, lessonRequest);
        return ResponseEntity.ok(newLesson);
    }
}
