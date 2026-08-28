package com.agazi.school.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "\"Grade\"", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"studentId", "subjectId", "term", "academicYear"})
})
@EntityListeners(AuditingEntityListener.class)
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private Float finalExam = 0.0f;

    @Column(nullable = false)
    private Float midExam = 0.0f;

    @Column(nullable = false)
    private Float quiz = 0.0f;

    @Column(nullable = false)
    private Float classActivity = 0.0f;

    @Column(nullable = false)
    private Float totalScore;

    @Column(nullable = false)
    private String letterGrade;

    @Column(nullable = false)
    private Boolean isPassed;

    @Column(nullable = false)
    private Integer term;

    @Column(nullable = false)
    private String academicYear;

    @ManyToOne(optional = false)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subjectId", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacherId")
    private Teacher teacher;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
