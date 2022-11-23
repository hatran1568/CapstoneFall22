package com.example.LocationService.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="request_attachment")
public class RequestAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="attachment_id",columnDefinition = "INT(1)")
    private int attachId;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @Column(name="url",columnDefinition = "text")
    private String url;


}
