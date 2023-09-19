package com.planner.backendserver.DTO.response;

import com.planner.backendserver.entity.User;
import java.sql.Date;
import lombok.Data;

public class TripDTO {

  int userId;
  double budget;
  String name;
  Date startDate;
  Date endDate;

  public int getUserId() {
    return userId;
  }

  public double getBudget() {
    return budget;
  }

  public String getName() {
    return name;
  }

  public Date getStartDate() {
    return startDate;
  }

  public Date getEndDate() {
    return endDate;
  }
}
