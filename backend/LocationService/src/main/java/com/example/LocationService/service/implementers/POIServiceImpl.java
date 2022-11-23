package com.example.LocationService.service.implementers;

import com.example.LocationService.config.ModelMapperConfig;
import com.example.LocationService.config.RestTemplateClient;
import com.example.LocationService.dto.request.HotelsRequestDTO;
import com.example.LocationService.dto.response.*;
import com.example.LocationService.entity.*;
import com.example.LocationService.repository.CustomActivityRepository;
import com.example.LocationService.repository.MasterActivityRepository;
import com.example.LocationService.repository.POIImageRepository;
import com.example.LocationService.repository.POIRepository;
import com.example.LocationService.service.interfaces.POIService;

import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class POIServiceImpl implements POIService {
    @Autowired
    POIRepository poiRepository;

    @Autowired
    POIImageRepository poiImageRepository;

    @Autowired
    RestTemplateClient restTemplate;

    @Autowired
    private DiscoveryClient discoveryClient;

    @Autowired
    private MasterActivityRepository masterActivityRepository;

    @Autowired
    CustomActivityRepository customActivityRepository;
    @Autowired
    ModelMapper mapper;
    @Override
    public ArrayList<RatingDTO> getRatingListByPOIId(int poiId,String token) {

        List<ServiceInstance> instances = discoveryClient.getInstances("user-service");

        ServiceInstance instance =  instances.get(0);

       log.info(String.valueOf(instance.getUri()));

        ArrayList<RatingDTO> list = new ArrayList<>();
        ArrayList<RatingDBDTO> objects = poiRepository.getRatingsByPOIId(poiId);
        for (RatingDBDTO rating : objects) {
            UserDetailResponseDTO user= restTemplate.restTemplate().getForObject(String.valueOf(instance.getUri())+"/api/user/findById/"+rating.getUserId(), UserDetailResponseDTO.class);
            RatingDTO ratingDTO = new RatingDTO(rating.getRateId(), rating.getRate(), rating.getComment(), rating.getDeleted(), rating.getCreated(), rating.getModified(), rating.getUserId(), user.getName(), rating.getPoiId());
            if (!ratingDTO.isDeleted()) {
                list.add(ratingDTO);
            }
        }
        return list;
    }

    @Override
    public void updateRatingInPOI(int rate, String comment, Date modified, int uid, int poiId) {
        poiRepository.updateRatingInPOI(rate, comment, modified, uid, poiId);
    }

    @Override
    public void createRatingInPOI(String comment, Date created, Date modified, int rate, int poiId, int uid) {
        poiRepository.createRatingInPOI(comment, created, modified, rate, poiId, uid);
    }

    @Override
    public ArrayList<SearchPOIAndDestinationDTO> getHotelsByDestination(HotelsRequestDTO input) {
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
        ArrayList<POI> pois =new ArrayList<>();
        if(input.getPoiId()==-1){
             pois = poiRepository.getHotelByPriceAndRate(maxRate,minRate,maxPrice,minPrice).get();
        }
        else{
            pois = poiRepository.getHotelByDestination(input.getDistance(),input.getPoiId() ,maxRate,minRate,maxPrice,minPrice).get();
        }
        for (POI poi : pois) {
            int numberOfRate = 0;
            if (poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO = new SearchPOIAndDestinationDTO(poi.getActivityId(), poi.getName(), POI.mapFromPOICategory(poi), poi.getGoogleRate(), numberOfRate, poi.getDescription(), poiRepository.getThumbnailById(poi.getActivityId()).isPresent() ? poiRepository.getThumbnailById(poi.getActivityId()).get() : null, true, poi.getLatitude(), poi.getLongitude(), poi.getWebsite(), poi.getTypicalPrice());
            list.add(PoiDTO);
        }
        return list;
    }

    @Override
    public Page<SearchPOIAndDestinationDTO> listToPage(List<SearchPOIAndDestinationDTO> list, int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        int start = Math.min((int) paging.getOffset(), list.size());
        int end = Math.min((start + paging.getPageSize()), list.size());

        return new PageImpl<SearchPOIAndDestinationDTO>(list.subList(start, end), PageRequest.of(page, size), list.size());
    }

    @Override
    public Integer cloneCustomActivity(int id) {
        MasterActivity activity = masterActivityRepository.getPOIByActivityId(id);
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setName(activity.getName());
        masterActivity.setAddress(activity.getAddress());
        int newId = masterActivityRepository.save(masterActivity).getActivityId();
        CustomActivity customActivity = new CustomActivity();
        customActivity.setActivityId(newId);
        customActivity.setName(masterActivity.getName());
        customActivity.setAddress(masterActivity.getAddress());
        Integer newCustomId = customActivityRepository.save(customActivity).getActivityId();
       return  newCustomId;
    }

    @Override
    public double getTypicalPriceById(int id) {
        POI p = poiRepository.getById(id);

        return p.getTypicalPrice();
    }
    @Override
    public MasterActivityDTO getMasterActivity(int id){

        MasterActivityDTO masterActivityDTO = mapper.map(masterActivityRepository.getById(id), MasterActivityDTO.class);
        if(poiRepository.existsById(masterActivityDTO.getActivityId())){
            com.example.LocationService.dto.POIDTO poidto = mapper.map(poiRepository.getPOIByActivityId(masterActivityDTO.getActivityId()), com.example.LocationService.dto.POIDTO.class);
            ArrayList<POIImage> listImages = new ArrayList<>();
            POIImage poiImage = poiImageRepository.findFirstByPoiId(poidto.getActivityId());
            if(poiImage != null) listImages.add(poiImage);
            poidto.setImages(listImages);
            poidto.setCustom(false);
            return poidto;
        }else{
            masterActivityDTO.setCustom(true);
            return masterActivityDTO;
        }
    }

    @Override
    public Integer insertCustomActivity(String name,String address) {
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setName(name);
        masterActivity.setAddress(address);
        int newId = masterActivityRepository.save(masterActivity).getActivityId();
        CustomActivity customActivity = new CustomActivity();
        customActivity.setActivityId(newId);
        customActivity.setName(masterActivity.getName());
        customActivity.setAddress(masterActivity.getAddress());
        Integer newCustomId = customActivityRepository.save(customActivity).getActivityId();
        return  newCustomId;
    }

    @Override
    public void editCustom(TripDetailDTO input) {
        masterActivityRepository.findById(input.getMasterActivity().getActivityId())
                .map(activity -> {
                    activity.setName(input.getMasterActivity().getName());
                    activity.setAddress(input.getMasterActivity().getAddress());
                    return masterActivityRepository.save(activity);

                }).orElseGet(() -> null);
    }

    @Override
    public String getFirstPOIImage(int id) {
        POIImage poiImage = poiImageRepository.findFirstByPoiId(id);
        if (poiImage == null) return null;
        return poiImage.getUrl();
    }
}
