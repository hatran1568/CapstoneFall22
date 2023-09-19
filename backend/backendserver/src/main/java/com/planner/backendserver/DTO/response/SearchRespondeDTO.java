package com.planner.backendserver.DTO.response;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import java.util.List;
import lombok.Data;

@Data
public class SearchRespondeDTO {

  List<SearchPOIAndDestinationDTO> list;
  int totalPage;
  int currentPage;
}
