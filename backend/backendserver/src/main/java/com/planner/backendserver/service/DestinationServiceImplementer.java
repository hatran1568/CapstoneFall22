package com.planner.backendserver.service;

import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.service.interfaces.DestinationService;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DestinationServiceImplementer implements DestinationService {

  @Autowired
  DestinationRepository destinationRepository;

  @Override
  public ArrayList<Destination> searchDestinationByKeyword(String keyword) {
    return destinationRepository.getDestinationsByKeyword(keyword);
  }
}
