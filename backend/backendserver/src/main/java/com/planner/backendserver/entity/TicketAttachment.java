package com.planner.backendserver.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ticket_attachment")
public class TicketAttachment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "attachment_id", columnDefinition = "INT(1)")
  private int attachmentId;

  @ManyToOne
  @JoinColumn(name = "ticket_id", nullable = false)
  private Ticket ticket;

  @Column(name = "url", columnDefinition = "text")
  private String url;

  @Column(name = "description", columnDefinition = "text")
  private String description;
}
