package com.planner.backendserver.DTO;

import java.sql.Date;

public class GenerateTripUserInput {
    private Date startDate;
    private Date endDate;
    private int userId;
    private int DestinationId;
    private int budgetPerDay;
    private int[] userPreference;

    private int startTime;
    private int endTime;

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getDestinationId() {
        return DestinationId;
    }

    public void setDestinationId(int destinationId) {
        DestinationId = destinationId;
    }

    public int getBudgetPerDay() {
        return budgetPerDay;
    }

    public void setBudgetPerDay(int budgetPerDay) {
        this.budgetPerDay = budgetPerDay;
    }

    public int[] getUserPreference() {
        return userPreference;
    }

    public void setUserPreference(int[] userPreference) {
        this.userPreference = userPreference;
    }
}
