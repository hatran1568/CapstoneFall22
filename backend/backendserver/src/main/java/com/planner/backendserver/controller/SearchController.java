package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.SearchPOIAndDestinationDTO;
import com.planner.backendserver.DTO.SearchType;
import com.planner.backendserver.DTO.response.SearchRespondeDTO;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.entity.Trip;
import com.planner.backendserver.service.interfaces.DestinationService;
import com.planner.backendserver.service.interfaces.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    SearchService searchService;
    @GetMapping("/all/{keyword}")
    public ResponseEntity<List<SearchPOIAndDestinationDTO>> searchPOIAndDestinationByKeyword(@PathVariable String keyword){


        try{
            List<SearchPOIAndDestinationDTO> results = searchService.suggestSearchPOIAndDestinationByKeyword(keyword);
            if (results.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<List<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{keyword}/{page}")
    public ResponseEntity<SearchRespondeDTO> searchByKeyword(@PathVariable String keyword, @PathVariable int page){
        try{
            List<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
            Page<SearchPOIAndDestinationDTO> paging = searchService.listToPage(results,page,10);


            if (paging.getContent().isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            SearchRespondeDTO respondeDTO = new SearchRespondeDTO();
            respondeDTO.setList(paging.getContent());
            respondeDTO.setTotalPage((int) Math.ceil(results.size()/10.0));
            respondeDTO.setCurrentPage(page);
            return new ResponseEntity<SearchRespondeDTO>(respondeDTO, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/filter/{keyword}/{page}/{type}")
    public ResponseEntity<SearchRespondeDTO> filterByKeywordAndType(@PathVariable String keyword,@PathVariable int page,@PathVariable String type){
        try{
            List<SearchPOIAndDestinationDTO> results = searchService.searchPOIAndDestinationByKeyword(keyword);
            results = searchService.filterPOIAndDestinationByType(SearchType.valueOf(type),results);
            Page<SearchPOIAndDestinationDTO> paging = searchService.listToPage(results,page,10);
            if (paging.getContent().isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            SearchRespondeDTO respondeDTO = new SearchRespondeDTO();
            respondeDTO.setList(paging.getContent());
            respondeDTO.setTotalPage((int) Math.ceil(results.size()/10.0));
            respondeDTO.setCurrentPage(page);
            return new ResponseEntity<SearchRespondeDTO>(respondeDTO, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/type")
    public ResponseEntity<List<Enum>> getAllType(){
        try{
            List<Enum> list = searchService.getAllType();
            if(list.isEmpty()){
                return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return  new ResponseEntity<List<Enum>>(list,HttpStatus.OK);
        }

        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/poi/{keyword}")
    public ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>> searchPOIByKeyword(@PathVariable String keyword) {
        ArrayList<SearchPOIAndDestinationDTO> results = searchService.searchPOIByKeyword(keyword);
        return new ResponseEntity<ArrayList<SearchPOIAndDestinationDTO>>(results, HttpStatus.OK);
    }
}
