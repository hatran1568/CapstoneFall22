package com.tripplanner.LocationService.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class SearchRespondeDTO {

  List<SearchPOIAndDestinationDTO> list;
  int totalPage;
  int currentPage;
}
