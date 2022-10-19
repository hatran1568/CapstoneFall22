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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;

@Service
public class SearchServiceImpl implements SearchService {
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
            SearchPOIAndDestinationDTO destinationDTO = new SearchPOIAndDestinationDTO(destination.getDestinationId(),destination.getName(), SearchType.DESTINATION);
            list.add(destinationDTO);
        }
        for (POI poi: pois) {
            SearchPOIAndDestinationDTO PoiDTO = new SearchPOIAndDestinationDTO(poi.getActivityId(),poi.getName(), SearchType.POI);
            list.add(PoiDTO);
        }

        for(Blog blog :blogs){
            SearchPOIAndDestinationDTO blogDTO = new SearchPOIAndDestinationDTO(blog.getBlogId(),blog.getTitle(), SearchType.BLOG);
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
}
