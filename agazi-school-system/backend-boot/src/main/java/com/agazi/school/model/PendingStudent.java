package com.agazi.school.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "\"PendingStudent\"")
@EntityListeners(AuditingEntityListener.class)
public class PendingStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    private String gender;
    @Column(nullable = false)
    private String phoneNumber;
    private String address;
    @Column(nullable = false)
    private Integer gradeLevel;
    @Enumerated(EnumType.STRING)
    private Stream stream;
    private String fatherName;
    private String motherName;
    private String guardianName;
    private String guardianPhone;
    private String emergencyContact;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;
    private String reviewedBy;
    private String reviewComments;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
