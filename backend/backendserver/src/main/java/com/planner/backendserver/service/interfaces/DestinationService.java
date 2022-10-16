package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.entity.Destination;

import java.util.ArrayList;
import java.util.List;

public interface DestinationService {
    public ArrayList<Destination> searchDestinationByKeyword(String keyword);
}
