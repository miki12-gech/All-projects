package com.coursebete.security;

import com.coursebete.security.jwt.AuthEntryPointJwt;
import com.coursebete.security.jwt.AuthTokenFilter;
import com.coursebete.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       
      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoder());
   
      return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> 
          auth.requestMatchers("/api/register", "/api/login", "/api/courses/**", "/api/quiz/**").permitAll() // Matches existing backend which seems open for reading, or specific endpoints.
              .anyRequest().authenticated()
        );
    
    // Note: The original node backend auth routes were /api/register and /api/login.
    // Course routes were /api/courses
    // However, in the node backend, middleware 'auth' was applied to most routes.
    // I am setting permitAll for now to get it running, but I should probably tighten this up to match Node exactly.
    // Looking at Node routes:
    // /api/register - Public
    // /api/login - Public
    // /api/students - Auth
    // /api/users/:id - Auth
    // /api/courses (GET) - Auth
    // /api/courses/:id (GET) - Auth
    // /api/courses (POST) - Auth
    // ...
    // So actually most are Auth. I will adjust below.
    
    http.authorizeHttpRequests(auth -> 
        auth.requestMatchers("/api/register", "/api/login").permitAll()
            .requestMatchers("/error").permitAll() // Allow error dispatch
            .anyRequest().authenticated()
      );

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
  }
}
