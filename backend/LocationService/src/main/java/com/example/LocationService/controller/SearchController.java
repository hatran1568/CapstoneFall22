package com.example.LocationService.controller;


import com.example.LocationService.dto.response.SearchPOIAndDestinationDTO;
import com.example.LocationService.dto.response.SearchRespondeDTO;
import com.example.LocationService.dto.response.SearchType;
import com.example.LocationService.service.interfaces.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/location/search")
public class SearchController {
    @Autowired
    SearchService searchService;
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/all/{keyword}")
    public ResponseEntity<List<SearchPOIAndDestinationDTO>> searchPOIAndDestinationByKeyword(@PathVariable String keyword) {
//        try {
            List<SearchPOIAndDestinationDTO> results = searchService.suggestSearchPOIAndDestinationByKeyword(keyword);
            if (results.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<List<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/Destination/{keyword}")
    public ResponseEntity<List<SearchPOIAndDestinationDTO>> searchDestinationByKeyword(@PathVariable String keyword) {
//        try {
            List<SearchPOIAndDestinationDTO> results = searchService.suggestSearchPOIAndDestinationByKeyword(keyword);
            if (results.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            List<SearchPOIAndDestinationDTO> result = new ArrayList<>();
            for (SearchPOIAndDestinationDTO poi:results) {
                if(poi.getType().equals(SearchType.DESTINATION)){
                    result.add(poi);
                }
            }
            return new ResponseEntity<List<SearchPOIAndDestinationDTO>>(result, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/{keyword}/{page}")
    public ResponseEntity<SearchRespondeDTO> searchByKeyword(@PathVariable String keyword, @PathVariable int page) {
        List<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
        try {
            // List<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
            Page<SearchPOIAndDestinationDTO> paging = searchService.listToPage(results, page, 10);
            if (paging.getContent().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            SearchRespondeDTO respondeDTO = new SearchRespondeDTO();
            respondeDTO.setList(paging.getContent());
            respondeDTO.setTotalPage((int) Math.ceil(results.size() / 10.0));
            respondeDTO.setCurrentPage(page);
            return new ResponseEntity<SearchRespondeDTO>(respondeDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/filter/{keyword}/{page}/{type}")
    public ResponseEntity<SearchRespondeDTO> filterByKeywordAndType(@PathVariable String keyword, @PathVariable int page, @PathVariable String type) {
        try {
            List<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
            results = searchService.filterPOIAndDestinationByType(SearchType.valueOf(type), results);
            Page<SearchPOIAndDestinationDTO> paging = searchService.listToPage(results, page, 10);
            if (paging.getContent().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            SearchRespondeDTO respondeDTO = new SearchRespondeDTO();
            respondeDTO.setList(paging.getContent());
            respondeDTO.setTotalPage((int) Math.ceil(results.size() / 10.0));
            respondeDTO.setCurrentPage(page);
            return new ResponseEntity<SearchRespondeDTO>(respondeDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/type")
    public ResponseEntity<List<Enum>> getAllType() {
        try {
            List<Enum> list = searchService.getAllType();
            if (list.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<List<Enum>>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/poi/{keyword}")
    public ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>> searchPOIByKeyword(@PathVariable String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> results = searchService.searchPOIByKeyword(keyword);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }
}
