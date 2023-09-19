package com.planner.backendserver.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "optimize_request")
public class OptimizerRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "request_id", columnDefinition = "INT(1)")
  private int requestId;

  @Column(name = "instance_uri")
  private String uri;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "stauts")
  @Enumerated(EnumType.STRING)
  private RequestStatus status;

  @ManyToOne
  @JoinColumn(name = "trip_id", nullable = true)
  private Trip trip;
}
