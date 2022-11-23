package com.example.LocationService.service.interfaces;

import com.example.LocationService.dto.request.HotelsRequestDTO;
import com.example.LocationService.dto.response.MasterActivityDTO;
import com.example.LocationService.dto.response.RatingDTO;

import com.example.LocationService.dto.response.SearchPOIAndDestinationDTO;
import com.example.LocationService.dto.response.TripDetailDTO;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public interface POIService {
    ArrayList<RatingDTO> getRatingListByPOIId(int poiId,String token);
    void updateRatingInPOI(int rate, String comment, Date modified, int uid, int poiId);
    void createRatingInPOI(String comment, Date created, Date modified, int rate, int poiId, int uid);
    ArrayList<SearchPOIAndDestinationDTO> getHotelsByDestination(HotelsRequestDTO input);
     Page<SearchPOIAndDestinationDTO> listToPage(List<SearchPOIAndDestinationDTO> list, int page, int size);

     Integer cloneCustomActivity(int id);
     double getTypicalPriceById(int id);

    public MasterActivityDTO getMasterActivity(int id);

    public Integer insertCustomActivity(String name,String address);

    public void editCustom(TripDetailDTO input);

    public String getFirstPOIImage(int id);
}
