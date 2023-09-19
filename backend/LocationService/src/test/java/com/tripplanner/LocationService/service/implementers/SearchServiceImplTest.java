package com.tripplanner.LocationService.service.implementers;

import static org.mockito.Mockito.*;

import com.tripplanner.LocationService.config.RestTemplateClient;
import com.tripplanner.LocationService.dto.response.Blog;
import com.tripplanner.LocationService.dto.response.ListBlogDTO;
import com.tripplanner.LocationService.dto.response.SearchPOIAndDestinationDTO;
import com.tripplanner.LocationService.dto.response.SearchType;
import com.tripplanner.LocationService.entity.Category;
import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.entity.POI;
import com.tripplanner.LocationService.repository.DestinationRepository;
import com.tripplanner.LocationService.repository.POIRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

@SpringBootTest
class SearchServiceImplTest {

  @Autowired
  private SearchServiceImpl service;

  @MockBean
  private POIRepository poiRepo;

  @MockBean
  private DestinationRepository destinationRepo;

  @MockBean
  private RestTemplateClient restTemplateClient;

  @MockBean
  private DiscoveryClient discoveryClient;

  @Nested
  class SearchEverythingByKeywordTest {

    @Test
    void thumbnailExistingCase() {
      String thumbnail = "";
      testing(Optional.of(thumbnail));
    }

    @Test
    void noThumbnailCase() {
      testing(Optional.empty());
    }

    void testing(Optional<String> thumbnailOptional) {
      ArrayList<Destination> destinations = new ArrayList<>();
      Destination destination = new Destination();
      destination.setDestinationId(1);
      destination.setName("");
      destinations.add(destination);
      doReturn(destinations).when(destinationRepo).getDestinationsByKeyword("");
      ArrayList<POI> pois = new ArrayList<>();
      POI poi = new POI();
      poi.setActivityId(1);
      poi.setName("");
      Category category = new Category();
      category.setCategoryID(1);
      category.setCategoryName("");
      poi.setCategory(category);
      pois.add(poi);
      doReturn(pois).when(poiRepo).findPOISByKeyword("");
      List<ServiceInstance> instances = new ArrayList<>();
      ServiceInstance instance = mock(ServiceInstance.class);
      instances.add(instance);
      doReturn(instances).when(discoveryClient).getInstances("blog-service");
      RestTemplate restTemplate = mock(RestTemplate.class);
      doReturn(restTemplate).when(restTemplateClient).restTemplate();
      ListBlogDTO blogs = new ListBlogDTO();
      ArrayList<Blog> list = new ArrayList<>();
      Blog blog = new Blog();
      blog.setBlogId(1);
      blog.setTitle("");
      blog.setThumbnail("");
      list.add(blog);
      blogs.setList(list);
      when(
        restTemplate.getForObject(
          instance.getUri() + "/blog/api/blog/keyword/" + "",
          ListBlogDTO.class
        )
      )
        .thenReturn(blogs);
      doReturn(thumbnailOptional).when(destinationRepo).getThumbnailById(1);
      int rating = 1;
      Optional<Integer> ratingOptional = Optional.of(rating);
      doReturn(ratingOptional).when(poiRepo).getNumberOfRateByActivityId(1);
      doReturn(thumbnailOptional).when(poiRepo).getThumbnailById(1);

      ArrayList<SearchPOIAndDestinationDTO> returnedList = service.searchPOIAndDestinationByKeyword(
        ""
      );
      Page<SearchPOIAndDestinationDTO> returnedPage = service.listToPage(
        returnedList,
        1,
        1
      );
      List<SearchPOIAndDestinationDTO> returnedTrim = service.suggestSearchPOIAndDestinationByKeyword(
        ""
      );
      List<SearchPOIAndDestinationDTO> returnedFilter = service.filterPOIAndDestinationByType(
        SearchType.DESTINATION,
        returnedList
      );
      ArrayList<SearchPOIAndDestinationDTO> returnedPois = service.searchPOIByKeyword(
        ""
      );

      Assertions.assertEquals(returnedList.size(), 3);
      Assertions.assertEquals(returnedPage.getTotalElements(), 3);
      Assertions.assertEquals(returnedTrim.size(), 3);
      Assertions.assertEquals(returnedFilter.size(), 1);
      Assertions.assertEquals(returnedPois.size(), 1);
    }
  }

  @Test
  void getAllTypeTest() {
    List<Enum> returnedList = service.getAllType();

    Assertions.assertEquals(returnedList.size(), 14);
  }
}
