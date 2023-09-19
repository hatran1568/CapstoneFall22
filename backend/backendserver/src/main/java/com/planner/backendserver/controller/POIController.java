package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.request.HotelsRequestDTO;
import com.planner.backendserver.DTO.request.POIListDTO;
import com.planner.backendserver.DTO.request.POIofDestinationDTO;
import com.planner.backendserver.DTO.request.UpdatePOIDTO;
import com.planner.backendserver.DTO.response.*;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.repository.DistanceRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.POIService;
import com.planner.backendserver.utils.GoogleDriveManager;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/pois")
public class POIController {

  private final String distanceToken = "dfSi1azlI6gjmUz4R8yMccBW2JGvb";

  @Autowired
  private DistanceRepository distanceRepository;

  @Autowired
  private POIRepository poiRepo;

  @Autowired
  private POIService poiService;

  @Autowired
  GoogleDriveManager driveManager;

  @GetMapping("/{desid}/{page}/{catid}/{rating}")
  public ResponseEntity<ArrayList<POIofDestinationDTO>> getPOIsOfDestinationFilter(
    @PathVariable("desid") int desid,
    @PathVariable("page") int page,
    @PathVariable("catid") int catid,
    @PathVariable("rating") int rating
  ) {
    try {
      ArrayList<POIofDestinationDTO> pois;
      if (catid == 0) pois =
        poiRepo.getPOIOfDestination(desid, page * 10, 10, rating); else pois =
        poiRepo.getPOIOfDestinationFilter(desid, catid, page * 10, 10, rating);
      if (pois.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      return new ResponseEntity<>(pois, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/{desid}/{catid}/{rating}/count")
  public ResponseEntity<Integer> getCountPOIsOfDestination(
    @PathVariable("desid") int desid,
    @PathVariable("catid") int catid,
    @PathVariable("rating") int rating
  ) {
    try {
      int count;
      if (catid == 0) count =
        poiRepo.getCountPOIOfDestination(desid, rating); else count =
        poiRepo.getCountPOIOfDestinationFilter(desid, catid, rating);
      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/{poiId}")
  public ResponseEntity<MasterActivity> getPOIDetails(
    @PathVariable("poiId") int poiId
  ) {
    try {
      MasterActivity poi;
      poi = poiRepo.getPOIByActivityId(poiId);
      if (poi == null) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(poi, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/{poiId}/ratings")
  public ResponseEntity<ArrayList<RatingDTO>> getPOIRatings(
    @PathVariable("poiId") int poiId
  ) {
    ArrayList<RatingDTO> rate;
    rate = poiService.getRatingListByPOIId(poiId);
    if (rate.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(rate, HttpStatus.OK);
  }

  @GetMapping("/{poiId}/images")
  public ResponseEntity<ArrayList<String>> getPOIImages(
    @PathVariable("poiId") int poiId
  ) {
    try {
      ArrayList<String> img;
      img = poiRepo.getImagesByPOIId(poiId);
      if (img.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(img, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping("/editRating")
  public ResponseEntity<ArrayList<RatingDTO>> updateRating(
    @RequestBody RatingDTO dto
  ) {
    try {
      int rate = dto.getRate();
      String comment = dto.getComment();
      Date modified = new Date(System.currentTimeMillis());
      int uid = dto.getUserId();
      int poiId = dto.getPoiId();
      poiService.updateRatingInPOI(rate, comment, modified, uid, poiId);
      ArrayList<RatingDTO> list = poiService.getRatingListByPOIId(poiId);
      return new ResponseEntity<>(list, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/createRating")
  public ResponseEntity<ArrayList<RatingDTO>> createRating(
    @RequestBody RatingDTO dto
  ) {
    try {
      int rate = dto.getRate();
      String comment = dto.getComment();
      Date created = new Date(System.currentTimeMillis());
      int uid = dto.getUserId();
      int poiId = dto.getPoiId();
      poiService.createRatingInPOI(comment, created, created, rate, poiId, uid);
      ArrayList<RatingDTO> list = poiService.getRatingListByPOIId(poiId);
      return new ResponseEntity<>(list, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/hotel/query")
  public ResponseEntity<SearchRespondeDTO> getHotelsByDestination(
    @RequestBody HotelsRequestDTO input
  ) {
    log.info(input.toString());
    try {
      ArrayList<SearchPOIAndDestinationDTO> results = poiService.getHotelsByDestination(
        input
      );
      Page<SearchPOIAndDestinationDTO> paging = poiService.listToPage(
        results,
        input.getPage(),
        10
      );
      if (paging.getContent().isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      SearchRespondeDTO respondeDTO = new SearchRespondeDTO();
      respondeDTO.setList(paging.getContent());
      respondeDTO.setTotalPage((int) Math.ceil(results.size() / 10.0));
      respondeDTO.setCurrentPage(input.getPage());
      return new ResponseEntity<SearchRespondeDTO>(respondeDTO, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @GetMapping("/list/admin/{filter}/{catId}/{nameKey}/{page}")
  public ResponseEntity<ArrayList<POIListDTO>> getPOIListAdmin(
    @PathVariable("filter") String filter,
    @PathVariable("page") int page,
    @PathVariable("catId") int catId,
    @PathVariable("nameKey") String nameKey
  ) {
    try {
      ArrayList<POIListDTO> pois;
      if (nameKey.equals("*")) nameKey = "";
      pois = poiRepo.getPOIListAdmin(filter, catId, nameKey, page * 30, 30);
      return new ResponseEntity<>(pois, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @GetMapping("/list/admin/count/{catId}/{nameKey}")
  public ResponseEntity<Integer> getPOIListAdminCount(
    @PathVariable("catId") int catId,
    @PathVariable("nameKey") String nameKey
  ) {
    try {
      int count;
      if (nameKey.equals("*")) nameKey = "";
      count = poiRepo.getPOIListAdminCount(catId, nameKey);
      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(
    value = "/delete/{poiId}",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> deletePOI(@PathVariable int poiId) {
    try {
      if (poiRepo.getById(poiId) == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      poiRepo.deletePOI(poiId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/list/admin/update/{poiId}")
  public ResponseEntity<POIUpdateDTO> getPOIUpdate(
    @PathVariable("poiId") int poiId
  ) {
    try {
      POIUpdateDTO poi;
      poi = poiRepo.getPOIUpdate(poiId);
      if (poi == null) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(poi, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @GetMapping("/list/admin/update/images/{poiId}")
  public ResponseEntity<ArrayList<POIImageUpdateDTO>> getPOIImageUpdate(
    @PathVariable("poiId") int poiId
  ) {
    try {
      ArrayList<POIImageUpdateDTO> images = poiRepo.getPOIImagesUpdate(poiId);
      if (images.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(images, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @RequestMapping(
    value = "/update",
    consumes = "application/json",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> updatePOI(@RequestBody UpdatePOIDTO poi) {
    try {
      java.sql.Timestamp date = new java.sql.Timestamp(
        Calendar.getInstance().getTime().getTime()
      );
      poiRepo.updateMA(poi.getActivityId(), poi.getAddress(), poi.getName());
      poiRepo.updatePOI(
        poi.getActivityId(),
        poi.getDescription(),
        poi.getAdditionalInfo(),
        poi.getEmail(),
        poi.getClosingTime(),
        date,
        poi.getDuration(),
        poi.getOpeningTime(),
        poi.getPhoneNumber(),
        poi.getPrice(),
        poi.getWebsite(),
        poi.getCategoryId(),
        poi.getRating(),
        poi.getLat(),
        poi.getLon()
      );
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @Transactional(rollbackFor = { Exception.class, Throwable.class })
  @RequestMapping(
    value = "/add",
    consumes = "application/json",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> addPOI(@RequestBody UpdatePOIDTO poi)
    throws Exception {
    try {
      String uri =
        "https://api.distancematrix.ai/maps/api/distancematrix/json?origins=";
      String origin = poi.getLat() + "," + poi.getLon();

      RestTemplate restTemplate = new RestTemplate();
      ArrayList<POI> pois = poiRepo.getPOIsByDestinationId(1);
      String dest = "";
      int index = 0;
      for (POI des : pois) {
        index++;
        dest += des.getLatitude() + "," + des.getLongitude();
        if (index != pois.size()) dest += "|";
      }
      uri = uri + origin + "&destinations=" + dest + "&key=" + distanceToken;
      ObjectMapper mapper = new ObjectMapper();
      Gson gson = new GsonBuilder().create();
      String result = restTemplate.getForObject(uri, String.class);
      DistanceMatrixDTO target2 = gson.fromJson(
        result,
        DistanceMatrixDTO.class
      );
      java.sql.Timestamp date = new java.sql.Timestamp(
        Calendar.getInstance().getTime().getTime()
      );
      poiRepo.addMA(poi.getAddress(), poi.getName());
      poiRepo.addPOI(
        poi.getDescription(),
        poi.getAdditionalInfo(),
        poi.getEmail(),
        poi.getClosingTime(),
        date,
        date,
        poi.getDuration(),
        poi.getOpeningTime(),
        poi.getPhoneNumber(),
        poi.getPrice(),
        poi.getWebsite(),
        poiRepo.getLastestPOI(),
        poi.getCategoryId(),
        poi.getRating(),
        false,
        poi.getLat(),
        poi.getLon()
      );
      index = 0;
      log.info(String.valueOf(poiRepo.getLastestPOI()));
      for (Row row : target2.getRows()) {
        for (Element e : row.elements) {
          distanceRepository.insertDistance(
            e.distance.value / 1000.0,
            poiRepo.getLastestPOI(),
            pois.get(index).getActivityId()
          );
          distanceRepository.insertDistance(
            e.distance.value / 1000.0,
            pois.get(index).getActivityId(),
            poiRepo.getLastestPOI()
          );

          index++;
        }
      }
      distanceRepository.insertDistance(
        0,
        poiRepo.getLastestPOI(),
        poiRepo.getLastestPOI()
      );
      return new ResponseEntity<>(poiRepo.getLastestPOI(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @PostMapping("/addImg/{poiId}/{description}")
  @ResponseBody
  public ResponseEntity<?> addImage(
    @PathVariable int poiId,
    @PathVariable String description,
    @RequestPart("File") MultipartFile file
  ) throws Exception {
    //        try{
    String webViewLink = driveManager.uploadFile(file, "tripplanner/img/poi");
    if (description.equals("*")) poiRepo.addImage(
      poiId,
      null,
      webViewLink
    ); else poiRepo.addImage(poiId, description, webViewLink);
    return new ResponseEntity<>(HttpStatus.OK);
    //        } catch (Exception e){
    //            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    //        }
  }

  @RequestMapping(
    value = "/deleteImg/{imgId}",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> deleteImg(@PathVariable int imgId) {
    try {
      String oldAvatar = poiRepo.getUrlPOIImage(imgId);
      if (oldAvatar != null) {
        driveManager.deleteFile(oldAvatar.split("id=")[1]);
      }
      poiRepo.deleteImage(imgId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
