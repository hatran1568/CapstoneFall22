package com.tripplanner.TripService.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class TripListDTO {

  List<TripGeneralDTO> list;
  int totalPage;
  int currentPage;
}
