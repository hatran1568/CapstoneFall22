package com.tripplanner.LocationService.dto.response;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
public class POIDTO {

  private int id;
  private String name;

  private double typicalPrice;
}
