package com.tripplanner.LocationService.service.implementers;

import com.tripplanner.LocationService.config.RestTemplateClient;
import com.tripplanner.LocationService.dto.response.Blog;
import com.tripplanner.LocationService.dto.response.ListBlogDTO;
import com.tripplanner.LocationService.dto.response.SearchPOIAndDestinationDTO;
import com.tripplanner.LocationService.dto.response.SearchType;
import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.entity.POI;
import com.tripplanner.LocationService.repository.DestinationRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import com.tripplanner.LocationService.service.interfaces.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {
    @Autowired
    POIRepository poiRepository;

    @Autowired
    DestinationRepository destinationRepository;

    @Autowired
    RestTemplateClient restTemplateClient;

    @Autowired
    private DiscoveryClient discoveryClient;

    @Override
    public ArrayList<SearchPOIAndDestinationDTO> searchPOIAndDestinationByKeyword(String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
        ArrayList<Destination> destinations = destinationRepository.getDestinationsByKeyword(keyword);
        ArrayList<POI> pois = poiRepository.findPOISByKeyword(keyword);
        List<ServiceInstance> instances = discoveryClient.getInstances("blog-service");

        ServiceInstance instance = instances.get(0);
        ListBlogDTO blogs = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/blog/api/blog/keyword/" + keyword, ListBlogDTO.class);
//        ArrayList<Blog> blogs = blogRepository.getBlogsByKeyword(keyword);
        for (Destination destination : destinations) {
            SearchPOIAndDestinationDTO destinationDTO =
                    new SearchPOIAndDestinationDTO(
                            destination.getDestinationId(),
                            destination.getName(),
                            SearchType.DESTINATION,
                            0,
                            0,
                            destination.getDescription(),
                            destinationRepository
                                    .getThumbnailById(destination.getDestinationId()).isPresent()
                                    ? destinationRepository.getThumbnailById(destination.getDestinationId()).get()
                                    : null,
                            false
                    );
            list.add(destinationDTO);
        }

        for (POI poi : pois) {
            int numberOfRate = 0;
            if (poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO =
                    new SearchPOIAndDestinationDTO(
                            poi.getActivityId(),
                            poi.getName(),
                            POI.mapFromPOICategory(poi),
                            poi.getGoogleRate(),
                            numberOfRate,
                            poi.getDescription(),
                            poiRepository.getThumbnailById(poi.getActivityId()).isPresent()
                                    ? poiRepository.getThumbnailById(poi.getActivityId()).get()
                                    : null,
                            true
                    );
            list.add(PoiDTO);
        }

        for (Blog blog : blogs.getList()) {
            SearchPOIAndDestinationDTO blogDTO =
                    new SearchPOIAndDestinationDTO(
                            blog.getBlogId(),
                            blog.getTitle(),
                            SearchType.BLOG,
                            0,
                            0,
                            blog.getContent(),
                            blog.getThumbnail(),
                            false
                    );
            list.add(blogDTO);
        }
        return list;

    }

    @Override
    public Page<SearchPOIAndDestinationDTO> listToPage(List<SearchPOIAndDestinationDTO> list, int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        int start = Math.min((int) paging.getOffset(), list.size());
        int end = Math.min((start + paging.getPageSize()), list.size());
        return new PageImpl<>(list.subList(start, end), PageRequest.of(page, size), list.size());
    }

    @Override
    public List<SearchPOIAndDestinationDTO> suggestSearchPOIAndDestinationByKeyword(String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
        ArrayList<Destination> destinations = destinationRepository.getDestinationsByKeyword(keyword);
        ArrayList<POI> pois = poiRepository.findPOISByKeyword(keyword);
        List<ServiceInstance> instances = discoveryClient.getInstances("blog-service");

        ServiceInstance instance = instances.get(0);
        ListBlogDTO blogs = restTemplateClient.restTemplate().getForObject(instance.getUri() + "/blog/api/blog/keyword/" + keyword, ListBlogDTO.class);
//        ArrayList<Blog> blogs = blogRepository.getBlogsByKeyword(keyword);
        for (Destination destination : destinations) {
            SearchPOIAndDestinationDTO destinationDTO =
                    new SearchPOIAndDestinationDTO(
                            destination.getDestinationId(),
                            destination.getName(),
                            SearchType.DESTINATION,
                            0,
                            0,
                            destination.getDescription(),
                            destinationRepository.getThumbnailById(destination.getDestinationId()).isPresent()
                                    ? destinationRepository.getThumbnailById(destination.getDestinationId()).get()
                                    : null,
                            false
                    );
            list.add(destinationDTO);
        }

        for (POI poi : pois) {
            int numberOfRate = 0;
            if (poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO =
                    new SearchPOIAndDestinationDTO(
                            poi.getActivityId(),
                            poi.getName(),
                            POI.mapFromPOICategory(poi),
                            poi.getGoogleRate(),
                            numberOfRate,
                            poi.getDescription(),
                            poiRepository.getThumbnailById(poi.getActivityId()).isPresent()
                                    ? poiRepository.getThumbnailById(poi.getActivityId()).get()
                                    : null,
                            true
                    );
            list.add(PoiDTO);
        }

        for (Blog blog : blogs.getList()) {
            SearchPOIAndDestinationDTO blogDTO =
                    new SearchPOIAndDestinationDTO(
                            blog.getBlogId(),
                            blog.getTitle(),
                            SearchType.BLOG,
                            0,
                            0,
                            blog.getContent(),
                            blog.getThumbnail(),
                            false
                    );
            list.add(blogDTO);
        }

        if (list.size() > 9) {
            ArrayList<SearchPOIAndDestinationDTO> finalList = new ArrayList<>();
            for (int i = 0; i < 9; i++) {
                finalList.add(list.get(i));
            }
            return finalList;
        }
        return list;
    }

    @Override
    public List<SearchPOIAndDestinationDTO> filterPOIAndDestinationByType(SearchType type, List<SearchPOIAndDestinationDTO> list) {
        List<SearchPOIAndDestinationDTO> results = list.stream().filter(p -> p.getType() == type).collect(Collectors.toList());
        return results;
    }

    @Override
    public List<Enum> getAllType() {
        return Arrays.asList(SearchType.values());
    }

    public ArrayList<SearchPOIAndDestinationDTO> searchPOIByKeyword(String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> list = new ArrayList<>();
        ArrayList<POI> pois = poiRepository.findPOISByKeyword(keyword);
        for (POI poi : pois) {
            int numberOfRate = 0;
            if (poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).isPresent())
                numberOfRate = poiRepository.getNumberOfRateByActivityId(poi.getActivityId()).get();
            SearchPOIAndDestinationDTO PoiDTO =
                    new SearchPOIAndDestinationDTO(
                            poi.getActivityId(),
                            poi.getName(),
                            POI.mapFromPOICategory(poi),
                            poi.getGoogleRate(),
                            numberOfRate,
                            poi.getDescription(),
                            poiRepository.getThumbnailById(poi.getActivityId()).isPresent()
                                    ? poiRepository.getThumbnailById(poi.getActivityId()).get()
                                    : null,
                            true
                    );
            list.add(PoiDTO);
        }

        if (list.size() > 9) {
            ArrayList<SearchPOIAndDestinationDTO> finalList = new ArrayList<>();
            for (int i = 0; i < 9; i++) {
                finalList.add(list.get(i));
            }
            return finalList;
        }
        return list;
    }
}
