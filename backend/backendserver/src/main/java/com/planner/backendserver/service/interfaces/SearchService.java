package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;

import java.util.ArrayList;

public interface SearchService {
    public ArrayList<SearchPOIAndDestinationDTO> searchPOIAndDestinationByKeyword(String keyword);
}
