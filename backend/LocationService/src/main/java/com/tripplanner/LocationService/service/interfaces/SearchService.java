package com.tripplanner.LocationService.service.interfaces;

import com.tripplanner.LocationService.dto.response.SearchPOIAndDestinationDTO;

import com.tripplanner.LocationService.dto.response.SearchType;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

public interface SearchService {
    public ArrayList<SearchPOIAndDestinationDTO> searchPOIByKeyword(String keyword);
    public List<SearchPOIAndDestinationDTO> searchPOIAndDestinationByKeyword(String keyword);
    public Page<SearchPOIAndDestinationDTO> listToPage(List<SearchPOIAndDestinationDTO> list, int page, int size);
    public List<SearchPOIAndDestinationDTO> suggestSearchPOIAndDestinationByKeyword(String keyword);

    public List<SearchPOIAndDestinationDTO> filterPOIAndDestinationByType(SearchType type, List<SearchPOIAndDestinationDTO> list);

    public List<Enum> getAllType();
}
