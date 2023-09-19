package com.example.UploadService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class UploadServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(UploadServiceApplication.class, args);
  }
}
