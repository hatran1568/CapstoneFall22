package com.planner.backendserver.service;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.SearchType;
import com.planner.backendserver.entity.Blog;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.repository.BlogRepository;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.repository.POIRepository;
import com.planner.backendserver.service.interfaces.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService{
    @Autowired
    POIRepository poiRepository;
    @Autowired
    DestinationRepository destinationRepository;
    @Autowired
    BlogRepository blogRepository;
    @Override
    public ArrayList<SearchPOIAndDestinationDTO> searchPOIAndDestinationByKeyword(String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
        ArrayList<Destination> destinations = destinationRepository.getDestinationsByKeyword(keyword);
        ArrayList<POI> pois = poiRepository.findPOISByKeyword(keyword);
        ArrayList<Blog> blogs = blogRepository.getBlogsByKeyword(keyword);
        for (Destination destination: destinations) {
            SearchPOIAndDestinationDTO destinationDTO = new SearchPOIAndDestinationDTO(destination.getDestinationId(),destination.getName(), SearchType.DESTINATION,0,0,destination.getDescription(), destinationRepository.getThumbnailById(destination.getDestinationId()),false);
            list.add(destinationDTO);
        }
        for (POI poi: pois) {
            int numberOfRate =0;
            if(poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO = new SearchPOIAndDestinationDTO(poi.getActivityId(),poi.getName(), mapFromPOICategory(poi),poi.getGoogleRate(), numberOfRate,poi.getDescription(), poiRepository.getThumbnailById(poi.getActivityId()),true );
            list.add(PoiDTO);
        }

        for(Blog blog :blogs){
            SearchPOIAndDestinationDTO blogDTO = new SearchPOIAndDestinationDTO(blog.getBlogId(),blog.getTitle(), SearchType.BLOG,0,0, blog.getContent(), blog.getThumbnail(),false);
            list.add(blogDTO);
        }
        return  list;

    }

    @Override
    public Page<SearchPOIAndDestinationDTO> listToPage(List<SearchPOIAndDestinationDTO> list, int page, int size){
        Pageable paging = PageRequest.of(page, size);
        int start = Math.min((int)paging.getOffset(),list.size());
        int end = Math.min((start + paging.getPageSize()), list.size());


        return new PageImpl<SearchPOIAndDestinationDTO>(list.subList(start, end), PageRequest.of(page, size), list.size());
    }

    @Override
    public List<SearchPOIAndDestinationDTO> suggestSearchPOIAndDestinationByKeyword(String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
        ArrayList<Destination> destinations = destinationRepository.getDestinationsByKeyword(keyword);
        ArrayList<POI> pois = poiRepository.findPOISByKeyword(keyword);
        ArrayList<Blog> blogs = blogRepository.getBlogsByKeyword(keyword);
        for (Destination destination: destinations) {
            SearchPOIAndDestinationDTO destinationDTO = new SearchPOIAndDestinationDTO(destination.getDestinationId(),destination.getName(), SearchType.DESTINATION,0,0,destination.getDescription(), destinationRepository.getThumbnailById(destination.getDestinationId()),false);
            list.add(destinationDTO);
        }
        for (POI poi: pois) {
            int numberOfRate =0;
            if(poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO = new SearchPOIAndDestinationDTO(poi.getActivityId(),poi.getName(), mapFromPOICategory(poi),poi.getGoogleRate(), numberOfRate,poi.getDescription(), poiRepository.getThumbnailById(poi.getActivityId()) ,true);
            list.add(PoiDTO);
        }

        for(Blog blog :blogs){
            SearchPOIAndDestinationDTO blogDTO = new SearchPOIAndDestinationDTO(blog.getBlogId(),blog.getTitle(), SearchType.BLOG,0,0, blog.getContent(), blog.getThumbnail(),false);
            list.add(blogDTO);
        }


       if(list.size()>9){
           ArrayList<SearchPOIAndDestinationDTO> finalList = new ArrayList<>();
           for(int i=0;i<9;i++){
                finalList.add(list.get(i));
           }
           return  finalList;
       }
       return  list;
    }

    @Override
    public List<SearchPOIAndDestinationDTO> filterPOIAndDestinationByType(SearchType type,List<SearchPOIAndDestinationDTO> list) {
        List<SearchPOIAndDestinationDTO> results = list.stream().filter(p ->p.getType()==type).collect(Collectors.toList());
        return  results;
    }

    @Override
    public List<Enum> getAllType() {
        List<Enum> enumValues = Arrays.asList(SearchType.values());
        return  enumValues;
    }

    public SearchType mapFromPOICategory(POI poi){
        switch (poi.getCategory().getCategoryName()){
            case "Art and Culture":
                return SearchType.ART_AND_CULTURE;
            case "Outdoors":
                return SearchType.OUTDOORS;
            case "Religion":
                return SearchType.RELIGION;
            case "Historic sights":
                return SearchType.HISTORIC_SIGHTS;
            case "Museums":
                return SearchType.MUSEUMS;
            case "Spas & Wellness":
                return SearchType.SPAS_AND_WELLNESS;
            case "Beaches":
                return SearchType.BEACHES;
            case "Hotels":
                return SearchType.HOTELS;
            case "Restaurants":
                return SearchType.RESTAURANTS;
            case "Shopping":
                return SearchType.SHOPPING;
            default:
                return SearchType.ENTERTAINMENTS;
        }
    }
}
