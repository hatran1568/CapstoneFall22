package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.SearchType;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;

public interface SearchService {
  public ArrayList<SearchPOIAndDestinationDTO> searchPOIByKeyword(
    String keyword
  );

  public List<SearchPOIAndDestinationDTO> searchPOIAndDestinationByKeyword(
    String keyword
  );

  public Page<SearchPOIAndDestinationDTO> listToPage(
    List<SearchPOIAndDestinationDTO> list,
    int page,
    int size
  );

  public List<SearchPOIAndDestinationDTO> suggestSearchPOIAndDestinationByKeyword(
    String keyword
  );

  public List<SearchPOIAndDestinationDTO> filterPOIAndDestinationByType(
    SearchType type,
    List<SearchPOIAndDestinationDTO> list
  );

  public List<Enum> getAllType();
}
