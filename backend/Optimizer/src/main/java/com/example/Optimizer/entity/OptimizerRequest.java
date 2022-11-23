package com.example.Optimizer.entity;


import lombok.Data;

import javax.persistence.*;

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

    @Column(name = "user_id", nullable = false)
    private Integer user;

    @Column(name = "stauts")
    @Enumerated(EnumType.STRING)
    private RequestStatus status;


    @Column(name = "trip_id", nullable = true)
    private Integer trip;


}
