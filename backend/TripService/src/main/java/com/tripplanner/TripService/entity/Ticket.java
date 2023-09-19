package com.tripplanner.TripService.entity;

import java.time.LocalTime;
import java.util.Date;
import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "ticket")
public class Ticket {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ticket_id", columnDefinition = "INT(1)")
  private int ticketId;

  @ManyToOne
  @JoinColumn(name = "trip_id", nullable = false)
  private Trip trip;

  @Column(name = "details", columnDefinition = "text")
  private String details;

  @Column(name = "departure_time")
  private LocalTime departureTime;

  @Column(name = "departure_date")
  private Date departureDate;

  @Column(name = "start_location", columnDefinition = "text")
  private String startLocation;

  @Column(name = "end_location", columnDefinition = "text")
  private String endLocation;

  @Column(name = "cost")
  private double cost;

  @Column(name = "note", columnDefinition = "text")
  private int note;

  @Enumerated(EnumType.STRING)
  @Column(name = "type")
  private TicketType type;

  @Column(name = "date_created")
  @Temporal(TemporalType.TIMESTAMP)
  @CreationTimestamp
  private Date dateCreated;

  @Column(name = "is_deleted")
  private boolean isDeleted;

  @Column(name = "date_modified")
  @UpdateTimestamp
  @Temporal(TemporalType.TIMESTAMP)
  private Date dateModified;
}
