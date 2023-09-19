package com.planner.backendserver.DTO.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.Trip;
import java.sql.Date;
import javax.persistence.*;
import lombok.Data;

@Data
public class TripDetailDTO {

  private int tripDetailsId;
  private MasterActivityDTO masterActivity;
  private int startTime;
  private int endTime;
  private Date date;
  private String note;
  private int dayNumber;
}
