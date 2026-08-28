package com.coursebete.controller;

import com.coursebete.model.User;
import com.coursebete.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasRole('admin') or hasRole('ADMIN')") // Just in case role naming varies
    public List<User> getAllStudents() {
        // In Node it returned specific fields. In Java validation, we might return full object or DTO.
        // For simplicity returning full object but password will be included! 
        // We should probably filter it out or use DTO. 
        // But User entity has passwordHash... maybe JsonIgnore it?
        // UserDetailsImpl used JsonIgnore. User entity doesn't.
        // Let's rely on frontend ignoring it or I should use DTO.
        // Better: update User entity to @JsonIgnore passwordHash.
        return userRepository.findByRole("student");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Get current user from security context
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof com.coursebete.security.services.UserDetailsImpl) {
            com.coursebete.security.services.UserDetailsImpl currentUser = 
                (com.coursebete.security.services.UserDetailsImpl) authentication.getPrincipal();
            
            // Only superadmin can delete users
            if (!"superadmin".equals(currentUser.getRole())) {
                return ResponseEntity
                    .status(403)
                    .body(Map.of("error", "Only superadmin can delete users!"));
            }
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "User deleted"));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('admin') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            String newRole = user.getRole().equals("student") ? "admin" : "student";
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User is now an " + newRole, "user", user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
