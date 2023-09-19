package com.tripplanner.Optimizer.DTO;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import lombok.Data;

@Data
public class Destination {

  private int destinationId;

  @Column(name = "name")
  private String name;

  private String description;

  private Date dateCreated;

  private boolean isDeleted;

  private Date dateModified;

  private Destination belongTo;

  private Set<Destination> listDest = new HashSet<>();
}
