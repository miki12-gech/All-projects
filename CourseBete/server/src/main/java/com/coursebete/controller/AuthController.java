package com.coursebete.controller;

import com.coursebete.dto.request.LoginRequest;
import com.coursebete.dto.request.SignupRequest;
import com.coursebete.dto.response.JwtResponse;
import com.coursebete.dto.response.MessageResponse;
import com.coursebete.model.User;
import com.coursebete.repository.UserRepository;
import com.coursebete.security.jwt.JwtUtils;
import com.coursebete.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         java.util.Collections.singletonList(userDetails.getRole())));
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
    if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User();
    user.setFullName(signUpRequest.getFullName());
    user.setEmail(signUpRequest.getEmail());
    user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
    user.setRole("student"); // Default role

    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/create-admin")
  public ResponseEntity<?> createAdmin(@RequestBody SignupRequest signUpRequest) {
    // Get current user from security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl currentUser = (UserDetailsImpl) authentication.getPrincipal();
    
    // Check if current user is superadmin
    if (!"superadmin".equals(currentUser.getRole())) {
      return ResponseEntity
          .status(403)
          .body(new MessageResponse("Error: Only superadmin can create admin users!"));
    }

    if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new admin account
    User admin = new User();
    admin.setFullName(signUpRequest.getFullName());
    admin.setEmail(signUpRequest.getEmail());
    admin.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
    admin.setRole("admin"); // Set as admin

    userRepository.save(admin);

    return ResponseEntity.ok(new MessageResponse("Admin user created successfully!"));
  }
}
