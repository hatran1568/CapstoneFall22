package com.planner.backendserver.service.implementers;

import com.planner.backendserver.DTO.response.DetailedTripDTO;
import com.planner.backendserver.DTO.response.MasterActivityDTO;
import com.planner.backendserver.DTO.response.POIDTO;
import com.planner.backendserver.DTO.response.TripDetailDTO;
import com.planner.backendserver.dto.response.TripGeneralDTO;
import com.planner.backendserver.entity.*;
import com.planner.backendserver.repository.*;
import com.planner.backendserver.service.interfaces.TripService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {
    @Autowired
    ModelMapper mapper;
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private TripDetailRepository tripDetailRepository;
    @Autowired
    private MasterActivityRepository masterActivityRepository;
    @Autowired
    private POIRepository poiRepository;
    @Autowired
    private CustomActivityRepository customActivityRepository;
    @Autowired
    private POIImageRepository poiImageRepository;

    @Override
    public DetailedTripDTO getDetailedTripById(int tripId) {
        Trip trip = tripRepository.findById(tripId);
        if(trip == null) return null;
        DetailedTripDTO tripDetailedDTO = mapper.map(trip, DetailedTripDTO.class);
        tripDetailedDTO.setListTripDetails(getListTripDetailDTO(tripId));
        return tripDetailedDTO;
    }
    public ArrayList<TripDetailDTO> getListTripDetailDTO(int tripId){
        ArrayList<TripDetails> tripDetails = tripDetailRepository.getListByTripId(tripId);
        ArrayList<TripDetailDTO> tripDetailDTOS = new ArrayList<>();
        for (TripDetails tripDetail: tripDetails) {
            TripDetailDTO tripDetailDTO = mapper.map(tripDetail, TripDetailDTO.class);
            MasterActivityDTO masterActivityDTO = tripDetailDTO.getMasterActivity();
            tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityDTO.getActivityId()));
            tripDetailDTOS.add(tripDetailDTO);
        }
        return tripDetailDTOS;
    }
    @Override
    public TripGeneralDTO getTripGeneralById(int id) {
        Trip trip = tripRepository.findById(id);
        if (trip == null) return null;
        TripGeneralDTO tripGeneralDTO = mapper.map(trip, TripGeneralDTO.class);
        tripGeneralDTO.setImage(getFirstPOIImage(trip.getTripId()));
        return tripGeneralDTO;
    }

    @Override
    public TripDetailDTO addTripDetail(Date date, int startTime, int endTime, int activityId, int tripId) {
        TripDetails tripDetails = new TripDetails();
        tripDetails.setDate(date);
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setActivityId(activityId);
        tripDetails.setMasterActivity(masterActivity);
        Trip trip = new Trip();
        trip.setTripId(tripId);
        tripDetails.setTrip(trip);
        TripDetailDTO saved = mapper.map(tripDetailRepository.save(tripDetails), TripDetailDTO.class);
        saved.setMasterActivity(getMasterActivity(saved.getMasterActivity().getActivityId()));
        return saved;
    }

    public MasterActivityDTO getMasterActivity(int id){
        if(!masterActivityRepository.existsById(id)) return null;
        MasterActivityDTO masterActivityDTO = mapper.map(masterActivityRepository.getById(id), MasterActivityDTO.class);
        if(poiRepository.existsById(masterActivityDTO.getActivityId())){
            POIDTO poidto = mapper.map(poiRepository.getPOIByActivityId(masterActivityDTO.getActivityId()), POIDTO.class);
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
    public TripDetails addCustomTripDetail(Date date, int startTime, int endTime, int tripId, String name, String address) {
        MasterActivity masterActivity = new MasterActivity();
        masterActivity.setName(name);
        masterActivity.setAddress(address);
        MasterActivity savedMasterActivity = masterActivityRepository.save(masterActivity);
        CustomActivity customActivity = new CustomActivity();
        customActivity.setActivityId(savedMasterActivity.getActivityId());
        customActivityRepository.save(customActivity);

        TripDetails tripDetails = new TripDetails();
        tripDetails.setDate(date);
        tripDetails.setStartTime(startTime);
        tripDetails.setEndTime(endTime);
        tripDetails.setMasterActivity(savedMasterActivity);

        Trip trip = new Trip();
        trip.setTripId(tripId);
        tripDetails.setTrip(trip);
        TripDetails saved = tripDetailRepository.save(tripDetails);
        return saved;
    }

    @Override
    public void deleteDetailById(int id) {
        tripDetailRepository.deleteById(id);
    }

    @Override
    public Optional<Double> getDistanceBetweenTwoPOIs(int from, int to) {
        return poiRepository.getDistanceBetweenTwoPOIs(from, to);
    }

    @Override
    public TripDetailDTO getTripDetailById(int id) {
        TripDetails tripDetails = tripDetailRepository.getTripDetailsById(id);
        if(tripDetails == null) return null;
        TripDetailDTO tripDetailDTO = mapper.map(tripDetails, TripDetailDTO.class);
        int masterActivityId = tripDetailDTO.getMasterActivity().getActivityId();
        tripDetailDTO.setMasterActivity(getMasterActivity(masterActivityId));
        return tripDetailDTO;
    }

    @Override
    public TripDetailDTO editTripDetailById(TripDetails newDetail, int id) {
        return tripDetailRepository.findById(id)
                .map(detail -> {
                    detail.setDate(newDetail.getDate());
                    detail.setStartTime(newDetail.getStartTime());
                    detail.setEndTime(newDetail.getEndTime());
                    TripDetailDTO saved = mapper.map(tripDetailRepository.save(detail), TripDetailDTO.class);
                    int masterActivityId = saved.getMasterActivity().getActivityId();
                    saved.setMasterActivity(getMasterActivity(masterActivityId));
                    return saved;
                })
                .orElseGet(() -> {
                    return mapper.map(tripDetailRepository.save(newDetail), TripDetailDTO.class);
                });
    }

    @Override
    public Optional<TripDetails> editCustomTripDetailById(TripDetails newDetail, int id) {
        MasterActivity masterActivity = newDetail.getMasterActivity();
        int maId = masterActivity.getActivityId();
        masterActivityRepository.findById(maId)
                .map(activity -> {
                    activity.setName(masterActivity.getName());
                    activity.setAddress(masterActivity.getAddress());
                    return masterActivityRepository.save(activity);
                }).orElseGet(() -> masterActivityRepository.save(masterActivity));
        return Optional.ofNullable(tripDetailRepository.findById(id)
                .map(detail -> {
                    detail.setDate(newDetail.getDate());
                    detail.setStartTime(newDetail.getStartTime());
                    detail.setEndTime(newDetail.getEndTime());
                    TripDetails saved = tripDetailRepository.save(detail);
                    return saved;
                })
                .orElseGet(() -> {
                    return tripDetailRepository.save(newDetail);
                }));
    }

    @Override
    public List<TripGeneralDTO> getTripsByUser(int userId) {
        ArrayList<Trip> trips = tripRepository.getTripsByUser(userId);

        return trips.stream().map(trip -> {
            TripGeneralDTO tripDTO = new TripGeneralDTO();
            tripDTO.setTripId(trip.getTripId());
            tripDTO.setName(trip.getName());
            tripDTO.setBudget(trip.getBudget());
            tripDTO.setStartDate(trip.getStartDate());
            tripDTO.setEndDate(trip.getEndDate());
            tripDTO.setImage(getFirstPOIImage(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteTripById(int id) {
        tripRepository.deleteTripById(id);
    }

    @Override
    public List<TripGeneralDTO> getLast3TripsByUser(int userId) {
        ArrayList<Trip> trips = tripRepository.getLast3TripsByUser(userId);

        return trips.stream().map(trip -> {
            TripGeneralDTO tripDTO = new TripGeneralDTO();
            tripDTO.setTripId(trip.getTripId());
            tripDTO.setName(trip.getName());
            tripDTO.setBudget(trip.getBudget());
            tripDTO.setStartDate(trip.getStartDate());
            tripDTO.setEndDate(trip.getEndDate());
            tripDTO.setImage(getFirstPOIImage(trip.getTripId()));
            tripDTO.setDateModified(trip.getDateModified());
            return tripDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public int countTripByUser(int userId) {
        return tripRepository.getNumberOfTripsByUser(userId);
    }

    private String getTripThumbnail(List<TripDetails> tripDetails) {
        if (tripDetails.size() == 0) {
            return null;
        }
        int masterActivityId = tripDetails.get(0).getMasterActivity().getActivityId();
        Optional<POI> poi = poiRepository.getPOIByMasterActivity(masterActivityId);
        if (poi.isPresent()) {
            ArrayList<POIImage> poiImages = poiImageRepository.findAllByPOIId(poi.get().getActivityId());
            if (poiImages.size() > 0)
                return poiImages.get(0).getUrl();
        }
        return null;
    }

    private String getFirstPOIImage(int tripId) {
        TripDetails tripDetails = tripDetailRepository.findFirstInTrip(tripId);
        if (tripDetails == null) return null;
        POIImage poiImage = poiImageRepository.findFirstByPoiId(tripDetails.getMasterActivity().getActivityId());
        if (poiImage == null) return null;
        return poiImage.getUrl();
    }
}
