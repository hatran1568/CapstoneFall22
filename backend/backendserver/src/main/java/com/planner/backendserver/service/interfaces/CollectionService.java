package com.planner.backendserver.service.interfaces;

import com.planner.backendserver.DTO.response.CollectionDTO;

import java.util.ArrayList;

public interface CollectionService {
    ArrayList<CollectionDTO> getCollectionListByUid(int uid);
}
