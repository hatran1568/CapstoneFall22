package com.planner.backendserver.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="request_attachment")
public class RequestAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="attach_id",columnDefinition = "INT(1)")
    private int attachId;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @Column(name="url")
    private String URL;


}
