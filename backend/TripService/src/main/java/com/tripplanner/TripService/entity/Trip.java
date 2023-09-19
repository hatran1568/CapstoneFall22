package com.tripplanner.TripService.entity;

import java.util.Date;
import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "trip")
public class Trip {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "trip_id", columnDefinition = "INT(1)")
  private int tripId;

  @Column(name = "user_id", nullable = false)
  private int user;

  @Column(name = "budget")
  private Double budget;

  @Type(type = "date")
  @Column(name = "start_date")
  private Date startDate;

  @Type(type = "date")
  @Column(name = "end_date")
  private Date endDate;

  @Column(name = "name")
  private String name;

  @Column(name = "date_created")
  @CreationTimestamp
  @Temporal(TemporalType.TIMESTAMP)
  private Date dateCreated;

  @Column(name = "date_modified")
  @UpdateTimestamp
  @Temporal(TemporalType.TIMESTAMP)
  private Date dateModified;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private TripStatus status;
}
