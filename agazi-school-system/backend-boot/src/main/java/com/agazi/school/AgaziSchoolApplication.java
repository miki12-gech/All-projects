package com.agazi.school;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AgaziSchoolApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgaziSchoolApplication.class, args);
	}

}
