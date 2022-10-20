package com.planner.backendserver.DTO.response;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import lombok.Data;

import java.util.List;

@Data
public class SearchRespondeDTO {
    List<SearchPOIAndDestinationDTO> list;
    int totalPage;
    int currentPage;
}
