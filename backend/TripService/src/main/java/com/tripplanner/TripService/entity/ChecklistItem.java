package com.tripplanner.TripService.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "checklist_item")
public class ChecklistItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "checklist_id", columnDefinition = "INT(1)")
  private int itemId;

  @ManyToOne
  @JsonIgnore
  @JoinColumn(name = "trip_id", nullable = false)
  private Trip trip;

  @Column(name = "checked")
  private boolean checked;

  @Column(name = "title", columnDefinition = "text")
  private String title;

  @Column(name = "note", columnDefinition = "text")
  private String note;

  @Column(name = "date_created")
  @Temporal(TemporalType.TIMESTAMP)
  @CreationTimestamp
  private Date dateCreated;

  @Column(name = "date_modified")
  @Temporal(TemporalType.TIMESTAMP)
  @UpdateTimestamp
  private Date dateModified;

  @Column(name = "is_deleted")
  private boolean isDeleted;
}
