package com.planner.backendserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "entity")
@EntityScan("entity")
public class BackendserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendserverApplication.class, args);
	}

}
