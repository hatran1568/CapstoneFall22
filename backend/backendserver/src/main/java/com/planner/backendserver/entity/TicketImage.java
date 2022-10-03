package com.planner.backendserver.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="ticket_image")
public class TicketImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="image_id",columnDefinition = "INT(1)")
    private int imageId;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name="url")
    private String URL;

    @Column(name="description", columnDefinition = "text")
    private String description;

}
