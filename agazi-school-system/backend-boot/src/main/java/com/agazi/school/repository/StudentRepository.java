package com.agazi.school.repository;

import com.agazi.school.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByUserId(String userId);
    List<Student> findByGradeLevel(Integer gradeLevel);
    List<Student> findByGradeLevelAndSection(Integer gradeLevel, String section);
}
