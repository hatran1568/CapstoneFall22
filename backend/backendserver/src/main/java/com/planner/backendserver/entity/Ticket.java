package com.planner.backendserver.entity;


import lombok.Data;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table(name="ticket")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ticket_id",columnDefinition = "INT(1)")
    private int ticketId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name="details", columnDefinition = "text")
    private String details;

    @Column(name="time")
    private Date time;


}
