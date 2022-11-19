package com.planner.backendserver.DTO.request;

public class UpdateDesDTO {
    int desId;
    String name;
    String description;
    int belongTo;

    public int getDesId() {
        return desId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getBelongTo() {
        return belongTo;
    }
}
