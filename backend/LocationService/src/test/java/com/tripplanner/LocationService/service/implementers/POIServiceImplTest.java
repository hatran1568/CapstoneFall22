package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.config.RestTemplateClient;
import com.tripplanner.LocationService.dto.request.HotelsRequestDTO;
import com.tripplanner.LocationService.dto.response.*;
import com.tripplanner.LocationService.entity.*;
import com.tripplanner.LocationService.repository.CustomActivityRepository;
import com.tripplanner.LocationService.repository.MasterActivityRepository;
import com.tripplanner.LocationService.repository.POIImageRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.data.domain.Page;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@SpringBootTest
class POIServiceImplTest {
    @Autowired
    private POIServiceImpl service;

    @MockBean
    private POIRepository poiRepo;

    @MockBean
    private POIImageRepository poiImgRepo;

    @MockBean
    private RestTemplateClient restTemplateClient;

    @MockBean
    private CustomActivityRepository caRepo;

    @MockBean
    private DiscoveryClient discoveryClient;

    @MockBean
    private MasterActivityRepository maRepo;

    @Test
    void getRatingListByPOIIdTest() {
        List<ServiceInstance> instances = new ArrayList<>();
        ServiceInstance instance = mock(ServiceInstance.class);
        instances.add(instance);
        RatingDBDTO object = new RatingDBDTO() {
            @Override
            public int getRateId() {
                return 1;
            }

            @Override
            public String getComment() {
                return "";
            }

            @Override
            public Date getCreated() {
                return null;
            }

            @Override
            public Date getModified() {
                return null;
            }

            @Override
            public boolean getDeleted() {
                return false;
            }

            @Override
            public int getRate() {
                return 4;
            }

            @Override
            public int getPoiId() {
                return 1;
            }

            @Override
            public int getUserId() {
                return 1;
            }
        };
        ArrayList<RatingDBDTO> objects = new ArrayList<>();
        objects.add(object);
        UserDetailResponseDTO user = new UserDetailResponseDTO();
        user.setName("");
        user.setAvatar("");
        RestTemplate restTemplate = mock(RestTemplate.class);
        doReturn(instances).when(discoveryClient).getInstances("user-service");
        doReturn(objects).when(poiRepo).getRatingsByPOIId(1);
        doReturn(restTemplate).when(restTemplateClient).restTemplate();
        when(
                restTemplate.getForObject(
                        instance.getUri() + "/user/api/user/findById/" + object.getUserId(),
                        UserDetailResponseDTO.class
                )
        ).thenReturn(user);

        ArrayList<RatingDTO> returnedList = service.getRatingListByPOIId(1, "");

        Assertions.assertEquals(returnedList.size(), 1);
    }

    @Test
    void updateRatingInPOITest() {
        Date date = new Date();
        doNothing().when(poiRepo).updateRatingInPOI(4, "", date, 1, 1);

        service.updateRatingInPOI(4, "", date, 1, 1);

        verify(poiRepo, times(1))
                .updateRatingInPOI(4, "", date, 1, 1);
    }

    @Test
    void createRatingInPOITest() {
        Date date = new Date();
        doNothing().when(poiRepo).createRatingInPOI("", date, date, 4, 1, 1);

        service.createRatingInPOI("", date, date, 4, 1, 1);

        verify(poiRepo, times(1))
                .createRatingInPOI("", date, date, 4, 1, 1);
    }

    @Nested
    class GetHotelsByDestinationTest {
        @Test
        void Case1() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(1);
            input.setPrice(1);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void Case2() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(1);
            input.setPrice(2);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void Case3() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(1);
            input.setPrice(3);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void Case4() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(1);
            input.setPrice(4);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void Case5() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(2);
            input.setPrice(1);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void Case6() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(3);
            input.setPrice(1);
            String thumbnail = "";

            testing(input, Optional.of(thumbnail));
        }

        @Test
        void CaseAbnormal() {
            HotelsRequestDTO input = new HotelsRequestDTO();
            input.setPoiId(-1);
            input.setPage(1);
            input.setDistance(1);
            input.setRate(0);
            input.setPrice(0);

            testing(input, Optional.empty());
        }

        void testing(HotelsRequestDTO input, Optional<String> thumbnailOptional) {
            POI poi = new POI();
            poi.setActivityId(1);
            poi.setName("");
            poi.setAddress("");
            poi.setGoogleRate(4);
            Category cat = new Category();
            cat.setCategoryName("");
            poi.setCategory(cat);
            poi.setDescription("");
            poi.setLatitude(0.0);
            poi.setLongitude(0.0);
            poi.setWebsite("");
            poi.setTypicalPrice(1.0);
            ArrayList<POI> list = new ArrayList<>();
            list.add(poi);
            Optional<ArrayList<POI>> listOptional = Optional.of(list);
            int rateNumber = 1;
            Optional<Integer> rateNumberOptional = Optional.of(rateNumber);
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
            doReturn(listOptional)
                    .when(poiRepo)
                    .getHotelByPriceAndRate(
                            maxRate,
                            minRate,
                            maxPrice,
                            minPrice
                    );
            doReturn(listOptional)
                    .when(poiRepo)
                    .getHotelByDestination(
                            input.getDistance(),
                            input.getPoiId(),
                            maxRate,
                            minRate,
                            maxPrice,
                            minPrice
                    );
            doReturn(rateNumberOptional).when(poiRepo).getNumberOfRateByActivityId(1);
            doReturn(thumbnailOptional).when(poiRepo).getThumbnailById(1);

            ArrayList<SearchPOIAndDestinationDTO> returnedList = service.getHotelsByDestination(input);
            Page<SearchPOIAndDestinationDTO> returnedPage = service.listToPage(returnedList, 1, 1);

            Assertions.assertEquals(returnedList.size(), 1);
            Assertions.assertEquals(returnedPage.getTotalElements(), 1);
        }
    }

    @Test
    void cloneCustomActivityTest() {
        MasterActivity ma = new MasterActivity();
        ma.setActivityId(1);
        ma.setName("");
        ma.setAddress("");
        doReturn(ma).when(maRepo).getPOIByActivityId(1);
        MasterActivity newMa = new MasterActivity();
        newMa.setActivityId(2);
        newMa.setName("");
        newMa.setAddress("");
        doReturn(newMa).when(maRepo).save(any());
        CustomActivity ca = new CustomActivity();
        ca.setActivityId(2);
        ca.setName("");
        ca.setAddress("");
        doReturn(ca).when(caRepo).save(any());

        int returnedId = service.cloneCustomActivity(1);

        Assertions.assertEquals(returnedId, 2);
    }

    @Test
    void getTypicalPriceByIdTest() {
        POI poi = new POI();
        poi.setTypicalPrice(1);
        doReturn(poi).when(poiRepo).getById(1);

        double returnedPrice = service.getTypicalPriceById(1);

        Assertions.assertEquals(returnedPrice, 1);
    }

    @Nested
    class GetMasterActivityTest {
        @Test
        void nonCustomCase() {
            MasterActivity ma = new MasterActivity();
            ma.setActivityId(1);
            ma.setName("");
            ma.setAddress("");
            doReturn(ma).when(maRepo).getById(1);
            doReturn(true).when(poiRepo).existsById(1);
            doReturn(ma).when(poiRepo).getPOIByActivityId(1);
            POIImage img = new POIImage();
            img.setImageId(1);
            img.setUrl("");
            POI poi = new POI();
            poi.setActivityId(1);
            img.setPoi(poi);
            doReturn(img).when(poiImgRepo).findFirstByPoiId(1);

            MasterActivityDTO returned = service.getMasterActivity(1);

            Assertions.assertFalse(returned.isCustom());
        }

        @Test
        void customCase() {
            MasterActivity ma = new MasterActivity();
            ma.setActivityId(1);
            ma.setName("");
            ma.setAddress("");
            doReturn(ma).when(maRepo).getById(1);
            doReturn(false).when(poiRepo).existsById(1);

            MasterActivityDTO returned = service.getMasterActivity(1);

            Assertions.assertTrue(returned.isCustom());
        }
    }

    @Test
    void insertCustomActivityTest() {
        MasterActivity ma = new MasterActivity();
        ma.setActivityId(1);
        ma.setName("");
        ma.setAddress("");
        doReturn(ma).when(maRepo).save(any());
        CustomActivity ca = new CustomActivity();
        ca.setActivityId(1);
        ca.setName("");
        ca.setAddress("");
        doReturn(ca).when(caRepo).save(any());

        int returnedId = service.insertCustomActivity("", "");

        Assertions.assertEquals(returnedId, 1);
    }

    @Test
    void editCustomTest() {
        TripDetailDTO input = new TripDetailDTO();
        input.setTripDetailsId(1);
        MasterActivityDTO masterActivityDTO = new MasterActivityDTO();
        masterActivityDTO.setActivityId(1);
        masterActivityDTO.setName("");
        masterActivityDTO.setAddress("");
        input.setMasterActivity(masterActivityDTO);
        MasterActivity ma = new MasterActivity();
        ma.setActivityId(1);
        ma.setName("");
        ma.setAddress("");
        Optional<MasterActivity> maOptional = Optional.of(ma);
        doReturn(maOptional).when(maRepo).findById(1);
        doReturn(ma).when(maRepo).save(any());

        service.editCustom(input);

        verify(maRepo, times(1)).save(any());
    }

    @Nested
    class GetFirstPOIImageTest {
        @Test
        void existingCase() {
            POIImage img = new POIImage();
            img.setImageId(1);
            img.setUrl("");
            POI poi = new POI();
            poi.setActivityId(1);
            img.setPoi(poi);
            doReturn(img).when(poiImgRepo).findFirstByPoiId(1);

            String returnedUrl = service.getFirstPOIImage(1);

            Assertions.assertEquals(returnedUrl, img.getUrl());
        }

        @Test
        void nonExistingCase() {
            doReturn(null).when(poiImgRepo).findFirstByPoiId(1);

            String returnedUrl = service.getFirstPOIImage(1);

            Assertions.assertNull(returnedUrl);
        }
    }

}