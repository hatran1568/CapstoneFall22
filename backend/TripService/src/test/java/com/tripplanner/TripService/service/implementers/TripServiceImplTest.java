package com.tripplanner.TripService.service.implementers;

import static org.mockito.Mockito.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tripplanner.TripService.config.RestTemplateClient;
import com.tripplanner.TripService.dto.Category;
import com.tripplanner.TripService.dto.POIDTO;
import com.tripplanner.TripService.dto.request.CustomActivityDTO;
import com.tripplanner.TripService.dto.response.*;
import com.tripplanner.TripService.entity.Trip;
import com.tripplanner.TripService.entity.TripDetails;
import com.tripplanner.TripService.entity.TripStatus;
import com.tripplanner.TripService.repository.ExpenseRepository;
import com.tripplanner.TripService.repository.TripDetailRepository;
import com.tripplanner.TripService.repository.TripRepository;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@SpringBootTest
class TripServiceImplTest {

  @Autowired
  private TripServiceImpl service;

  @MockBean
  private RestTemplateClient restTemplateClient;

  @MockBean
  private ModelMapper mapper;

  @MockBean
  private TripRepository tripRepository;

  @MockBean
  private TripDetailRepository tripDetailRepository;

  @MockBean
  private ExpenseRepository expenseRepository;

  @MockBean
  private DiscoveryClient discoveryClient;

  @Nested
  class GetDetailedTripByIdTest {

    @Test
    void case1() {
      Trip trip = new Trip();
      trip.setTripId(1);
      trip.setStatus(TripStatus.PUBLIC);
      trip.setUser(0);
      Date date = new Date(20000);
      trip.setStartDate(date);

      DetailedTripDTO returnedDto = test(trip, Boolean.TRUE, 0);

      Assertions.assertEquals(returnedDto.getUser(), 0);
    }

    @Test
    void case2() {
      DetailedTripDTO returnedDto = test(null, Boolean.FALSE, 1);

      Assertions.assertNull(returnedDto);
    }

    @Test
    void case3() {
      Trip trip = new Trip();
      trip.setTripId(1);
      trip.setStatus(TripStatus.PUBLIC);
      trip.setUser(0);
      java.sql.Date date = new Date(20000);
      trip.setStartDate(date);

      DetailedTripDTO returnedDto = test(trip, Boolean.FALSE, 1);

      Assertions.assertEquals(returnedDto.getUser(), 1);
    }

    DetailedTripDTO test(Trip trip, Boolean isCustom, int userId) {
      doReturn(trip).when(tripRepository).findById(1);
      List<ServiceInstance> userServiceInstances = new ArrayList<>();
      ServiceInstance userServiceInstance = mock(ServiceInstance.class);
      userServiceInstances.add(userServiceInstance);
      doReturn(userServiceInstances)
        .when(discoveryClient)
        .getInstances("user-service");
      RestTemplate restTemplate = mock(RestTemplate.class);
      doReturn(restTemplate).when(restTemplateClient).restTemplate();
      int guestId = 0;
      when(
        restTemplate.getForObject(
          userServiceInstance.getUri() + "/user/api/user/get-guest-id",
          Integer.class
        )
      )
        .thenReturn(guestId);
      List<ServiceInstance> locationServiceInstances = new ArrayList<>();
      ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
      locationServiceInstances.add(locationServiceInstance);
      doReturn(locationServiceInstances)
        .when(discoveryClient)
        .getInstances("location-service");
      List<TripDetailsQueryDTO> tripDetailedDTO = new ArrayList<>();
      TripDetailsQueryDTO query = new TripDetailsQueryDTO() {
        @Override
        public int getDetailsId() {
          return 1;
        }

        @Override
        public int getDayNumber() {
          return 5;
        }

        @Override
        public int getStartTime() {
          return 0;
        }

        @Override
        public String getNote() {
          return "";
        }

        @Override
        public int getEndTime() {
          return 0;
        }

        @Override
        public int getMasterActivity() {
          return 1;
        }

        @Override
        public int getTripId() {
          return 1;
        }
      };
      tripDetailedDTO.add(query);
      doReturn(tripDetailedDTO)
        .when(tripDetailRepository)
        .getTripDetailsByTrip(1);
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/isExistCustom/" +
          query.getMasterActivity(),
          Boolean.class
        )
      )
        .thenReturn(isCustom);
      MasterActivityDTO masterActivityDTO = new MasterActivityDTO();
      masterActivityDTO.setActivityId(1);
      masterActivityDTO.setName("");
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/getMasterActivity/" +
          query.getMasterActivity(),
          MasterActivityDTO.class
        )
      )
        .thenReturn(masterActivityDTO);
      POIDTO poiDto = new POIDTO();
      poiDto.setActivityId(1);
      poiDto.setName("");
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/getMasterActivity/" +
          query.getMasterActivity(),
          POIDTO.class
        )
      )
        .thenReturn(poiDto);
      DetailedTripDTO dto = new DetailedTripDTO();
      dto.setTripId(1);
      dto.setUser(userId);
      when(mapper.map(trip, DetailedTripDTO.class)).thenReturn(dto);

      return service.getDetailedTripById(1, userId);
    }
  }

  @Nested
  class GetTripGeneralByIdTest {

    @Test
    void case1() {
      Trip trip = new Trip();
      trip.setTripId(1);
      TripDetails tripDetails = new TripDetails();
      tripDetails.setTrip(trip);
      tripDetails.setMasterActivity(1);

      TripGeneralDTO returnedDto = test(trip, tripDetails);

      Assertions.assertEquals(returnedDto.getTripId(), 1);
    }

    @Test
    void case2() {
      TripGeneralDTO returnedDto = test(null, new TripDetails());

      Assertions.assertNull(returnedDto);
    }

    TripGeneralDTO test(Trip trip, TripDetails tripDetails) {
      doReturn(trip).when(tripRepository).findById(1);
      TripGeneralDTO dto = new TripGeneralDTO();
      dto.setTripId(1);
      dto.setName("");
      when(mapper.map(trip, TripGeneralDTO.class)).thenReturn(dto);
      doReturn(tripDetails).when(tripDetailRepository).findFirstInTrip(1);
      List<ServiceInstance> locationServiceInstances = new ArrayList<>();
      ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
      locationServiceInstances.add(locationServiceInstance);
      doReturn(locationServiceInstances)
        .when(discoveryClient)
        .getInstances("location-service");
      RestTemplate restTemplate = mock(RestTemplate.class);
      doReturn(restTemplate).when(restTemplateClient).restTemplate();
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/getFirstImg/" +
          tripDetails.getMasterActivity(),
          String.class
        )
      )
        .thenReturn("");

      return service.getTripGeneralById(1);
    }
  }

  @Nested
  class CloneTripTest {

    @Test
    void case1() {
      TripGeneralDTO returnedDto = test(Boolean.TRUE);

      Assertions.assertEquals(returnedDto.getTripId(), 2);
    }

    @Test
    void case2() {
      TripGeneralDTO returnedDto = test(Boolean.FALSE);

      Assertions.assertEquals(returnedDto.getTripId(), 2);
    }

    TripGeneralDTO test(Boolean isExist) {
      Trip originalTrip = new Trip();
      originalTrip.setTripId(1);
      originalTrip.setStartDate(new Date(100000));
      originalTrip.setEndDate(new Date(200000000));
      doReturn(originalTrip).when(tripRepository).findById(1);
      List<ServiceInstance> userServiceInstances = new ArrayList<>();
      ServiceInstance userServiceInstance = mock(ServiceInstance.class);
      userServiceInstances.add(userServiceInstance);
      doReturn(userServiceInstances)
        .when(discoveryClient)
        .getInstances("user-service");
      RestTemplate restTemplate = mock(RestTemplate.class);
      doReturn(restTemplate).when(restTemplateClient).restTemplate();
      int guestId = 0;
      when(
        restTemplate.getForObject(
          userServiceInstance.getUri() + "/user/api/user/get-guest-id",
          Integer.class
        )
      )
        .thenReturn(guestId);
      when(tripRepository.save(any())).thenReturn(originalTrip);
      TripGeneralDTO dto = new TripGeneralDTO();
      dto.setTripId(2);
      dto.setStartDate(originalTrip.getStartDate());
      dto.setEndDate(originalTrip.getEndDate());
      when(mapper.map(originalTrip, TripGeneralDTO.class)).thenReturn(dto);
      ArrayList<TripDetails> tripDetailsList = new ArrayList<>();
      TripDetails tripDetails = new TripDetails();
      tripDetails.setTripDetailsId(1);
      tripDetails.setTrip(originalTrip);
      tripDetails.setMasterActivity(1);
      tripDetails.setDayNumber(5);
      tripDetails.setStartTime(0);
      tripDetails.setNote("");
      tripDetails.setEndTime(2);
      tripDetailsList.add(tripDetails);
      doReturn(tripDetailsList).when(tripDetailRepository).getListByTripId(1);
      List<ServiceInstance> locationServiceInstances = new ArrayList<>();
      ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
      locationServiceInstances.add(locationServiceInstance);
      doReturn(locationServiceInstances)
        .when(discoveryClient)
        .getInstances("location-service");
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/isExistCustom/" +
          tripDetails.getMasterActivity(),
          Boolean.class
        )
      )
        .thenReturn(isExist);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      when(
        restTemplate.postForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/cloneCustom/" +
          tripDetails.getMasterActivity(),
          new HttpEntity<>("", headers),
          Integer.class
        )
      )
        .thenReturn(1);
      doNothing()
        .when(tripRepository)
        .insertTripDetails(
          tripDetails.getDayNumber(),
          tripDetails.getEndTime(),
          tripDetails.getNote(),
          tripDetails.getStartTime(),
          1,
          2
        );
      TripDetails newDetail = new TripDetails();
      newDetail.setTripDetailsId(2);
      when(tripDetailRepository.save(any())).thenReturn(newDetail);
      com.tripplanner.TripService.dto.response.POIDTO poiDto = new com.tripplanner.TripService.dto.response.POIDTO();
      poiDto.setTypicalPrice(69420);
      poiDto.setName("");
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/getPoiById/" +
          tripDetails.getMasterActivity(),
          com.tripplanner.TripService.dto.response.POIDTO.class
        )
      )
        .thenReturn(poiDto);
      doNothing()
        .when(expenseRepository)
        .insertExpense(poiDto.getTypicalPrice(), poiDto.getName(), 2, 2);

      return service.cloneTrip(0, 1, new Date(100000));
    }
  }

  @Test
  void addTripDetailGeneratedTest() {
    TripDetails td = new TripDetails();
    Trip t = new Trip();
    t.setTripId(1);
    td.setTripDetailsId(1);
    td.setTrip(t);
    td.setNote("");
    td.setDayNumber(5);
    td.setStartTime(0);
    td.setEndTime(2);
    td.setMasterActivity(1);
    when(tripDetailRepository.save(any())).thenReturn(td);

    Integer returnedId = service.addTripDetailGenerated(5, 0, 2, 1, 1, "");

    Assertions.assertEquals(returnedId, 1);
  }

  @Test
  void addCustomTripDetailTest() {
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    CustomActivityDTO customActivityDTO = new CustomActivityDTO();
    customActivityDTO.setAddress("");
    customActivityDTO.setName("");
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
    String personJsonObject = gson.toJson(customActivityDTO);
    HttpEntity<String> request = new HttpEntity<>(personJsonObject, headers);
    Integer id = 1;
    when(
      restTemplate.postForObject(
        locationServiceInstance.getUri() + "/location/api/pois/addCustom",
        request,
        Integer.class
      )
    )
      .thenReturn(id);
    Trip trip = new Trip();
    trip.setTripId(1);
    trip.setStartDate(new Date(10000));
    doReturn(trip).when(tripRepository).findById(1);
    TripDetails tripDetails = new TripDetails();
    tripDetails.setDayNumber(5);
    tripDetails.setStartTime(0);
    tripDetails.setEndTime(2);
    tripDetails.setMasterActivity(1);
    tripDetails.setTrip(trip);
    tripDetails.setNote("");
    when(tripDetailRepository.save(any())).thenReturn(tripDetails);
    TripDetailDTO tripDetailDTO = new TripDetailDTO();
    tripDetailDTO.setDayNumber(5);
    tripDetailDTO.setStartTime(0);
    tripDetailDTO.setEndTime(2);
    tripDetailDTO.setNote("");
    when(mapper.map(tripDetails, TripDetailDTO.class))
      .thenReturn(tripDetailDTO);
    POIDTO poiDto = new POIDTO();
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getMasterActivity/" +
        id,
        POIDTO.class
      )
    )
      .thenReturn(poiDto);

    TripDetailDTO returnedDto = service.addCustomTripDetail(
      new Date(2000000),
      0,
      2,
      1,
      "",
      "",
      ""
    );

    Assertions.assertEquals(returnedDto.getDayNumber(), 5);
  }

  @Test
  void deleteDetailByIdTest() {
    doNothing().when(tripDetailRepository).deleteById(1);

    service.deleteDetailById(1);

    verify(tripDetailRepository, times(1)).deleteById(1);
  }

  @Test
  void getDistanceBetweenTwoPOIsTest() {
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/distance/" +
        1 +
        "/" +
        2,
        Double.class
      )
    )
      .thenReturn(10.0);

    Optional<Double> returnedDistance = service.getDistanceBetweenTwoPOIs(1, 2);

    Assertions.assertEquals(returnedDistance.get(), 10.0);
  }

  @Nested
  class GetTripDetailByIdTest {

    @Test
    void case1() {
      TripDetails tripDetails = new TripDetails();
      tripDetails.setTripDetailsId(1);
      tripDetails.setDayNumber(2);
      Trip trip = new Trip();
      trip.setTripId(1);
      trip.setStartDate(new Date(10000));
      tripDetails.setTrip(trip);

      TripDetailDTO returnedDto = test(tripDetails);

      Assertions.assertEquals(returnedDto.getTripDetailsId(), 1);
    }

    @Test
    void case2() {
      TripDetailDTO returnedDto = test(null);

      Assertions.assertNull(returnedDto);
    }

    TripDetailDTO test(TripDetails tripDetails) {
      doReturn(tripDetails).when(tripDetailRepository).getTripDetailsById(1);
      TripDetailDTO tripDetailDTO = new TripDetailDTO();
      tripDetailDTO.setTripDetailsId(1);
      MasterActivityDTO masterActivityDTO = new MasterActivityDTO();
      masterActivityDTO.setActivityId(1);
      tripDetailDTO.setMasterActivity(masterActivityDTO);
      when(mapper.map(tripDetails, TripDetailDTO.class))
        .thenReturn(tripDetailDTO);
      List<ServiceInstance> locationServiceInstances = new ArrayList<>();
      ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
      locationServiceInstances.add(locationServiceInstance);
      doReturn(locationServiceInstances)
        .when(discoveryClient)
        .getInstances("location-service");
      RestTemplate restTemplate = mock(RestTemplate.class);
      doReturn(restTemplate).when(restTemplateClient).restTemplate();
      POIDTO poiDto = new POIDTO();
      poiDto.setActivityId(1);
      poiDto.setName("");
      Category category = new Category();
      category.setCategoryID(1);
      poiDto.setCategory(category);
      when(
        restTemplate.getForObject(
          locationServiceInstance.getUri() +
          "/location/api/pois/getMasterActivity/" +
          1,
          POIDTO.class
        )
      )
        .thenReturn(poiDto);

      return service.getTripDetailById(1);
    }
  }

  @Test
  void editCustomTripDetailByIdTest() {
    TripDetailDTO newDetail = new TripDetailDTO();
    newDetail.setStartTime(0);
    newDetail.setEndTime(3);
    newDetail.setDate(new Date(10000));
    newDetail.setNote("");
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
    String personJsonObject = gson.toJson(newDetail);
    HttpEntity<String> request = new HttpEntity<>(personJsonObject, headers);
    String response = "";
    when(
      restTemplate.exchange(
        locationServiceInstance.getUri() + "/location/api/pois/editCustom",
        HttpMethod.PUT,
        request,
        String.class
      )
    )
      .thenReturn(ResponseEntity.of(Optional.of(response)));
    TripDetails tripDetails = new TripDetails();
    tripDetails.setTripDetailsId(1);
    tripDetails.setMasterActivity(1);
    Trip trip = new Trip();
    trip.setStartDate(new Date(20000));
    tripDetails.setTrip(trip);
    tripDetails.setDayNumber(2);
    tripDetails.setStartTime(0);
    tripDetails.setEndTime(2);
    tripDetails.setNote("");
    Optional<TripDetails> tripDetailsOptional = Optional.of(tripDetails);
    doReturn(tripDetailsOptional).when(tripDetailRepository).findById(1);
    when(tripDetailRepository.save(any())).thenReturn(tripDetails);
    TripDetailDTO saved = new TripDetailDTO();
    saved.setTripDetailsId(tripDetails.getTripDetailsId());
    saved.setDayNumber(tripDetails.getDayNumber());
    saved.setStartTime(tripDetails.getStartTime());
    saved.setEndTime(tripDetails.getEndTime());
    saved.setNote(tripDetails.getNote());
    when(mapper.map(tripDetails, TripDetailDTO.class)).thenReturn(saved);
    POIDTO poiDto = new POIDTO();
    poiDto.setActivityId(1);
    poiDto.setName("");
    Category category = new Category();
    category.setCategoryID(1);
    poiDto.setCategory(category);
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getMasterActivity/" +
        1,
        POIDTO.class
      )
    )
      .thenReturn(poiDto);

    TripDetailDTO returnedDto = service.editCustomTripDetailById(
      newDetail,
      1,
      1
    );

    Assertions.assertEquals(returnedDto.getTripDetailsId(), 1);
  }

  //    @Test
  //    void getTripsByUserTest() {
  //        ArrayList<Trip> trips = new ArrayList<>();
  //        Trip trip = new Trip();
  //        trip.setTripId(1);
  //        trip.setName("");
  //        trip.setBudget(69420);
  //        trip.setStartDate(new Date(69420));
  //        trip.setEndDate(new Date(9999999));
  //        trip.setDateModified(new Date(69420));
  //        trips.add(trip);
  //        doReturn(trips).when(tripRepository).getTripsByUser(1);
  //        TripDetails tripDetails = new TripDetails();
  //        tripDetails.setMasterActivity(1);
  //        doReturn(tripDetails).when(tripDetailRepository).findFirstInTrip(1);
  //        List<ServiceInstance> locationServiceInstances = new ArrayList<>();
  //        ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
  //        locationServiceInstances.add(locationServiceInstance);
  //        doReturn(locationServiceInstances).when(discoveryClient).getInstances("location-service");
  //        RestTemplate restTemplate = mock(RestTemplate.class);
  //        doReturn(restTemplate).when(restTemplateClient).restTemplate();
  //        when(
  //                restTemplate.getForObject(
  //                        locationServiceInstance.getUri() + "/location/api/pois/getFirstImg/" + tripDetails.getMasterActivity(),
  //                        String.class
  //                )
  //        ).thenReturn("");
  //
  //        List<TripGeneralDTO> returnedList = service.getTripsByUser(1);
  //
  //        Assertions.assertEquals(returnedList.size(), 1);
  //    }

  @Test
  void deleteTripByIdTest() {
    doNothing().when(tripRepository).deleteTripById(1);

    service.deleteTripById(1);

    verify(tripRepository, times(1)).deleteTripById(1);
  }

  @Test
  void getLast3TripsByUserTest() {
    ArrayList<Trip> trips = new ArrayList<>();
    Trip trip = new Trip();
    trip.setTripId(1);
    trip.setName("");
    trip.setBudget(69420);
    trip.setStartDate(new Date(69420));
    trip.setEndDate(new Date(9999999));
    trip.setDateModified(new Date(69420));
    trips.add(trip);
    doReturn(trips).when(tripRepository).getLast3TripsByUser(1);
    TripDetails tripDetails = new TripDetails();
    tripDetails.setMasterActivity(1);
    doReturn(tripDetails).when(tripDetailRepository).findFirstInTrip(1);
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getFirstImg/" +
        tripDetails.getMasterActivity(),
        String.class
      )
    )
      .thenReturn("");

    List<TripGeneralDTO> returnedList = service.getLast3TripsByUser(1);

    Assertions.assertEquals(returnedList.size(), 1);
  }

  @Test
  void countTripByUserTest() {
    doReturn(69).when(tripRepository).getNumberOfTripsByUser(1);

    int returnedNumber = service.countTripByUser(1);

    Assertions.assertEquals(returnedNumber, 69);
  }

  @Test
  void editTripNameTest() {
    doNothing().when(tripRepository).updateTripName(1, "");

    service.editTripName(1, "");

    verify(tripRepository, times(1)).updateTripName(1, "");
  }

  @Test
  void editStartAndEndDatesTest() {
    Date startDate = new Date(69420);
    Date endDate = new Date(694200);
    doNothing()
      .when(tripRepository)
      .updateStartAndEndDates(1, startDate, endDate);

    service.editStartAndEndDates(1, startDate, endDate);

    verify(tripRepository, times(1))
      .updateStartAndEndDates(1, startDate, endDate);
  }

  @Test
  void getTripDetailsToBeDeletedTest() {
    Trip trip = new Trip();
    trip.setTripId(1);
    trip.setName("");
    trip.setBudget(69420);
    trip.setStartDate(new Date(69420));
    trip.setEndDate(new Date(9999999));
    trip.setDateModified(new Date(69420));
    doReturn(trip).when(tripRepository).findById(1);
    TripDetails tripDetails = new TripDetails();
    tripDetails.setTripDetailsId(1);
    tripDetails.setMasterActivity(1);
    tripDetails.setTrip(trip);
    tripDetails.setDayNumber(2);
    tripDetails.setStartTime(0);
    tripDetails.setEndTime(2);
    tripDetails.setNote("");
    ArrayList<TripDetails> tripDetailsList = new ArrayList<>();
    tripDetailsList.add(tripDetails);
    doReturn(tripDetailsList)
      .when(tripDetailRepository)
      .getTripDetailsOutOfRange(1, 5);
    TripDetailDTO tripDetailDTO = new TripDetailDTO();
    tripDetailDTO.setTripDetailsId(1);
    MasterActivityDTO masterActivityDTO = new MasterActivityDTO();
    masterActivityDTO.setActivityId(1);
    tripDetailDTO.setMasterActivity(masterActivityDTO);
    tripDetailDTO.setDayNumber(5);
    when(mapper.map(tripDetails, TripDetailDTO.class))
      .thenReturn(tripDetailDTO);
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    POIDTO poiDto = new POIDTO();
    poiDto.setActivityId(1);
    poiDto.setName("");
    Category category = new Category();
    category.setCategoryID(1);
    poiDto.setCategory(category);
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getMasterActivity/" +
        1,
        POIDTO.class
      )
    )
      .thenReturn(poiDto);

    List<TripDetailDTO> returnedList = service.getTripDetailsToBeDeleted(1, 5);

    Assertions.assertEquals(returnedList.size(), 1);
  }

  @Test
  void tripExistsTest() {
    doReturn(true).when(tripRepository).existsById(1);

    boolean returned = service.tripExists(1);

    Assertions.assertTrue(returned);
  }

  @Test
  void insertExpenseTest() {
    doNothing().when(expenseRepository).insertExpense(1, "", 1, 1);

    service.insertExpense(1, "", 1, 1);

    verify(expenseRepository, times(1)).insertExpense(1, "", 1, 1);
  }

  @Test
  void getPublicTripTest() {
    ArrayList<Trip> trips = new ArrayList<>();
    Trip trip = new Trip();
    trip.setTripId(1);
    trip.setName("");
    trip.setBudget(69420);
    trip.setStartDate(new Date(69420));
    trip.setEndDate(new Date(9999999));
    trip.setDateModified(new Date(69420));
    trips.add(trip);
    doReturn(trips)
      .when(tripRepository)
      .getPublicTrips(1, 1, "", 1, 5, new Date(69420));
    PublicTripDTO dto = new PublicTripDTO();
    dto.setTripId(trip.getTripId());
    dto.setName(trip.getName());
    dto.setBudget(trip.getBudget());
    dto.setStartDate(trip.getStartDate());
    dto.setEndDate(trip.getEndDate());
    when(mapper.map(trip, PublicTripDTO.class)).thenReturn(dto);
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getFirstImg/" +
        1,
        String.class
      )
    )
      .thenReturn("");
    String destination = "";
    ArrayList<String> destinations = new ArrayList<>();
    destinations.add(destination);
    doReturn(destinations).when(tripRepository).getDestinationsOfTrip(1);
    String poi = "";
    ArrayList<String> pois = new ArrayList<>();
    pois.add(poi);
    doReturn(pois).when(tripRepository).getPOIsByTripId(1, 5);

    ArrayList<PublicTripDTO> returnedList = service.getPublicTrips(
      1,
      1,
      "",
      1,
      5,
      new Date(69420)
    );

    Assertions.assertEquals(returnedList.size(), 1);
  }

  @Test
  void countPublicTripTest() {
    doReturn(69)
      .when(tripRepository)
      .getPublicTripsCount("", 1, 5, new Date(69420));

    int returnedCount = service.countPublicTrips("", 1, 5, new Date(69420));

    Assertions.assertEquals(returnedCount, 69);
  }

  @Test
  void toggleStatusTest() {
    doNothing().when(tripRepository).toggleStatus(1, "");

    service.toggleStatus(1, "");

    verify(tripRepository, times(1)).toggleStatus(1, "");
  }

  @Test
  void createEmptyTrip() {
    Trip trip = new Trip();
    trip.setStartDate(new Date(69420));
    trip.setEndDate(new Date(99999999));
    trip.setUser(1);
    trip.setName("");
    trip.setBudget(69420.0);
    Date now = new Date(Calendar.getInstance().getTime().getTime());
    trip.setDateCreated(now);
    trip.setDateModified(now);
    trip.setStatus(TripStatus.PRIVATE);
    when(tripRepository.save(any())).thenReturn(trip);
    TripGeneralDTO dto = new TripGeneralDTO();
    dto.setTripId(1);
    dto.setUser(trip.getUser());
    dto.setName(trip.getName());
    dto.setStartDate(trip.getStartDate());
    dto.setEndDate(trip.getEndDate());
    dto.setBudget(trip.getBudget());
    when(mapper.map(trip, TripGeneralDTO.class)).thenReturn(dto);

    TripGeneralDTO returnedDto = service.createEmptyTrip(
      69420.0,
      "",
      1,
      new Date(69420),
      new Date(99999999)
    );

    Assertions.assertEquals(returnedDto.getBudget(), 69420);
  }

  @Test
  void getLast3TripsByGuestTest() {
    Trip trip = new Trip();
    trip.setTripId(1);
    doReturn(trip).when(tripRepository).findById(1);
    TripGeneralDTO dto = new TripGeneralDTO();
    dto.setTripId(trip.getTripId());
    when(mapper.map(trip, TripGeneralDTO.class)).thenReturn(dto);
    List<ServiceInstance> locationServiceInstances = new ArrayList<>();
    ServiceInstance locationServiceInstance = mock(ServiceInstance.class);
    locationServiceInstances.add(locationServiceInstance);
    doReturn(locationServiceInstances)
      .when(discoveryClient)
      .getInstances("location-service");
    RestTemplate restTemplate = mock(RestTemplate.class);
    doReturn(restTemplate).when(restTemplateClient).restTemplate();
    when(
      restTemplate.getForObject(
        locationServiceInstance.getUri() +
        "/location/api/pois/getFirstImg/" +
        1,
        String.class
      )
    )
      .thenReturn("");

    int[] id = { 1 };
    List<TripGeneralDTO> returnedList = service.getLast3TripsByGuest(id);

    Assertions.assertEquals(returnedList.size(), 1);
  }
}
