package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.request.HotelsRequestDTO;
import com.planner.backendserver.DTO.response.RatingDTO;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.Rating;
import com.planner.backendserver.repository.POIImageRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.POIService;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class POIServiceImpl implements POIService {

  @Autowired
  POIRepository poiRepository;

  @Autowired
  POIImageRepository poiImageRepository;

  @Override
  public ArrayList<RatingDTO> getRatingListByPOIId(int poiId) {
    ArrayList<RatingDTO> list = new ArrayList<>();
    ArrayList<Rating> ratings = poiRepository.getRatingsByPOIId(poiId);
    for (Rating rating : ratings) {
      RatingDTO ratingDTO = new RatingDTO(
        rating.getRateId(),
        rating.getRate(),
        rating.getComment(),
        rating.isDeleted(),
        rating.getDateCreated(),
        rating.getDateModified(),
        rating.getUser().getUserID(),
        rating.getUser().getName(),
        rating.getPOI().getActivityId()
      );
      if (!ratingDTO.isDeleted()) {
        list.add(ratingDTO);
      }
    }
    return list;
  }

  @Override
  public void updateRatingInPOI(
    int rate,
    String comment,
    Date modified,
    int uid,
    int poiId
  ) {
    poiRepository.updateRatingInPOI(rate, comment, modified, uid, poiId);
  }

  @Override
  public void createRatingInPOI(
    String comment,
    Date created,
    Date modified,
    int rate,
    int poiId,
    int uid
  ) {
    poiRepository.createRatingInPOI(
      comment,
      created,
      modified,
      rate,
      poiId,
      uid
    );
  }

  @Override
  public ArrayList<SearchPOIAndDestinationDTO> getHotelsByDestination(
    HotelsRequestDTO input
  ) {
    ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
    double minPrice, maxPrice, minRate, maxRate;
    switch (input.getPrice()) {
      case 1:
        minPrice = 0;
        maxPrice = 1000000;
        break;
      case 2:
        minPrice = 1000000;
        maxPrice = 2000000;
        break;
      case 3:
        minPrice = 2000000;
        maxPrice = 3000000;
        break;
      case 4:
        minPrice = 3000000;
        maxPrice = Double.MAX_VALUE;
        break;
      default:
        minPrice = 0;
        maxPrice = Double.MAX_VALUE;
        break;
    }
    switch (input.getRate()) {
      case 1:
        minRate = 2;
        maxRate = 5;
        break;
      case 2:
        minRate = 3;
        maxRate = 5;
        break;
      case 3:
        minRate = 4;
        maxRate = 5;
        break;
      case 4:
        minRate = 5;
        maxRate = 5;
        break;
      default:
        minRate = 1;
        maxRate = 5;
        break;
    }
    ArrayList<POI> pois = new ArrayList<>();
    if (input.getPoiId() == -1) {
      pois =
        poiRepository
          .getHotelByPriceAndRate(maxRate, minRate, maxPrice, minPrice)
          .get();
    } else {
      pois =
        poiRepository
          .getHotelByDestination(
            input.getDistance(),
            input.getPoiId(),
            maxRate,
            minRate,
            maxPrice,
            minPrice
          )
          .get();
    }
    for (POI poi : pois) {
      int numberOfRate = 0;
      if (
        poiRepository
          .getNumberOfRateByActivityId(poi.getActivityId())
          .isPresent()
      ) numberOfRate =
        poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
      SearchPOIAndDestinationDTO PoiDTO = new SearchPOIAndDestinationDTO(
        poi.getActivityId(),
        poi.getName(),
        POI.mapFromPOICategory(poi),
        poi.getGoogleRate(),
        numberOfRate,
        poi.getDescription(),
        poiRepository.getThumbnailById(poi.getActivityId()).isPresent()
          ? poiRepository.getThumbnailById(poi.getActivityId()).get()
          : null,
        true,
        poi.getLatitude(),
        poi.getLongitude(),
        poi.getWebsite(),
        poi.getTypicalPrice()
      );
      list.add(PoiDTO);
    }
    return list;
  }

  @Override
  public Page<SearchPOIAndDestinationDTO> listToPage(
    List<SearchPOIAndDestinationDTO> list,
    int page,
    int size
  ) {
    Pageable paging = PageRequest.of(page, size);
    int start = Math.min((int) paging.getOffset(), list.size());
    int end = Math.min((start + paging.getPageSize()), list.size());

    return new PageImpl<SearchPOIAndDestinationDTO>(
      list.subList(start, end),
      PageRequest.of(page, size),
      list.size()
    );
  }
}
