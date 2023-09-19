package com.tripplanner.Optimizer.DTO;

import java.sql.Date;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@lombok.Data
public class Data {

  private int numberOfPOI;
  private int dayOfTrip;
  private POI[] POIs;
  private int numberofTags;

  private int poiTags[];
  private int[] userPreference;
  private double distanceOfPOI[][];
  private double maxHappiness;
  private double minHappiness;
  private double maxNumberOfDestinations;
  private double minNumberOfDestinations;
  private double maxWaitingTime;
  private double minWaitingTime;
  private double maxDistance;
  private double minDistance;
  private double[] dailyBudget;
  private double[] dailyStartTime;
  private double[] dailyEndTime;
  private Date startDate;
  private Date endDate;
  private double w1;
  private double w2;
  private double w3;
  private double w4;
  private int userId;

  public Data(
    Date _startDate,
    Date _endDate,
    double _distanceOfPOI[][],
    POI[] _POIs,
    int _numberOfPOI,
    int[] _userPreference,
    int _budget,
    int _start,
    int _end,
    int _userId
  ) {
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.numberOfPOI = _numberOfPOI;
    this.POIs = _POIs;
    this.distanceOfPOI = _distanceOfPOI;
    long diff = endDate.getTime() - startDate.getTime();
    this.userPreference = _userPreference;
    this.dayOfTrip =
      (int) TimeUnit.DAYS.convert(diff / (24 * 3600 * 1000), TimeUnit.DAYS) + 1;

    this.dailyBudget = new double[dayOfTrip];
    this.dailyStartTime = new double[dayOfTrip];
    this.dailyEndTime = new double[dayOfTrip];
    for (int i = 0; i < dayOfTrip; i++) {
      dailyBudget[i] = _budget / dayOfTrip;
      dailyStartTime[i] = _start;
      dailyEndTime[i] = _end;
    }
    this.recalculateRate();
    this.maxNumberOfDestinations = calcMaxNumberOfDestination();
    this.maxDistance = calcMaxDistance();
    this.maxHappiness = calcMaxHappiness();
    this.maxWaitingTime = calcMaxWaitingTime();
    this.minDistance = 0;
    this.minHappiness = 0;
    this.minWaitingTime = 0;
    this.minNumberOfDestinations = 0;
    this.userId = _userId;
    this.w1 = 10;
    this.w2 = 1;
    this.w3 = 1;
    this.w4 = 1;
  }

  public int getNumberOfPOI() {
    return numberOfPOI;
  }

  public void setNumberOfPOI(int numberOfPOI) {
    this.numberOfPOI = numberOfPOI;
  }

  public int getDayOfTrip() {
    return dayOfTrip;
  }

  public void setDayOfTrip(int dayOfTrip) {
    this.dayOfTrip = dayOfTrip;
  }

  public POI[] getPOIs() {
    return POIs;
  }

  public void setPOIs(POI[] POIs) {
    this.POIs = POIs;
  }

  public int getNumberofTags() {
    return numberofTags;
  }

  public void setNumberofTags(int numberofTags) {
    this.numberofTags = numberofTags;
  }

  public int[] getPoiTags() {
    return poiTags;
  }

  public void setPoiTags(int[] poiTags) {
    this.poiTags = poiTags;
  }

  public int[] getUserPreference() {
    return userPreference;
  }

  public void setUserPreference(int[] userPreference) {
    this.userPreference = userPreference;
  }

  public double[][] getDistanceOfPOI() {
    return distanceOfPOI;
  }

  public void setDistanceOfPOI(double[][] distanceOfPOI) {
    this.distanceOfPOI = distanceOfPOI;
  }

  public double getMaxHappiness() {
    return maxHappiness;
  }

  public void setMaxHappiness(double maxHappiness) {
    this.maxHappiness = maxHappiness;
  }

  public double getMinHappiness() {
    return minHappiness;
  }

  public void setMinHappiness(double minHappiness) {
    this.minHappiness = minHappiness;
  }

  public double getMaxNumberOfDestinations() {
    return maxNumberOfDestinations;
  }

  public void setMaxNumberOfDestinations(double maxNumberOfDestinations) {
    this.maxNumberOfDestinations = maxNumberOfDestinations;
  }

  public double getMinNumberOfDestinations() {
    return minNumberOfDestinations;
  }

  public void setMinNumberOfDestinations(double minNumberOfDestinations) {
    this.minNumberOfDestinations = minNumberOfDestinations;
  }

  public double getMaxWaitingTime() {
    return maxWaitingTime;
  }

  public void setMaxWaitingTime(double maxWaitingTime) {
    this.maxWaitingTime = maxWaitingTime;
  }

  public double getMinWaitingTime() {
    return minWaitingTime;
  }

  public void setMinWaitingTime(double minWaitingTime) {
    this.minWaitingTime = minWaitingTime;
  }

  public double getMaxDistance() {
    return maxDistance;
  }

  public void setMaxDistance(double maxDistance) {
    this.maxDistance = maxDistance;
  }

  public double getMinDistance() {
    return minDistance;
  }

  public void setMinDistance(double minDistance) {
    this.minDistance = minDistance;
  }

  public double[] getDailyBudget() {
    return dailyBudget;
  }

  public void setDailyBudget(double[] dailyBudget) {
    this.dailyBudget = dailyBudget;
  }

  public double[] getDailyStartTime() {
    return dailyStartTime;
  }

  public void setDailyStartTime(double[] dailyStartTime) {
    this.dailyStartTime = dailyStartTime;
  }

  public double[] getDailyEndTime() {
    return dailyEndTime;
  }

  public void setDailyEndTime(double[] dailyEndTime) {
    this.dailyEndTime = dailyEndTime;
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

  public double getW1() {
    return w1;
  }

  public void setW1(double w1) {
    this.w1 = w1;
  }

  public double getW2() {
    return w2;
  }

  public void setW2(double w2) {
    this.w2 = w2;
  }

  public double getW3() {
    return w3;
  }

  public void setW3(double w3) {
    this.w3 = w3;
  }

  public double getW4() {
    return w4;
  }

  public void setW4(double w4) {
    this.w4 = w4;
  }

  public void recalculateRate() {
    for (int i = 0; i < numberOfPOI; i++) {
      int finalI = i;
      if (
        Arrays
          .stream(userPreference)
          .anyMatch(n -> n == POIs[finalI].getCategory().getCategoryID())
      ) {
        POIs[finalI].setGoogleRate(POIs[finalI].getGoogleRate() * 1.5);
      }
    }
  }

  public double calcMaxDistance() {
    double maxElement = Double.MIN_VALUE;
    for (int i = 0; i < numberOfPOI; i++) {
      for (int j = 0; j < numberOfPOI; j++) {
        if (distanceOfPOI[i][j] > maxElement) {
          maxElement = distanceOfPOI[i][j];
        }
      }
    }
    return maxElement * (maxNumberOfDestinations - 1);
  }

  public int calcMaxNumberOfDestination() {
    double[] costArray = new double[numberOfPOI];
    for (int i = 0; i < this.numberOfPOI; i++) {
      costArray[i] = this.POIs[i].getTypicalPrice();
    }
    Arrays.sort(costArray);
    double totalBudget = Arrays.stream(this.dailyBudget).sum();
    int countCost = 0;
    double currentBudget = 0;
    for (int i = 0; i < costArray.length; i++) {
      currentBudget += costArray[i];
      if (currentBudget >= totalBudget) {
        break;
      }
      countCost = i;
    }
    int countTime = 0;
    double totalTimeBudget = Arrays.stream(this.dailyEndTime).sum();
    double currentTimeBudget = 0;
    double[] durationArray = new double[numberOfPOI];
    for (int i = 0; i < this.numberOfPOI; i++) {
      durationArray[i] = this.POIs[i].getDuration();
    }
    Arrays.sort(durationArray);
    for (int i = 0; i < durationArray.length; i++) {
      currentTimeBudget += durationArray[i];
      if (currentTimeBudget >= totalTimeBudget) {
        break;
      }
      countTime = i;
    }
    return Math.min(countCost, countTime) - 1;
  }

  public double calcMaxHappiness() {
    double maxElement = Double.MIN_VALUE;
    for (int i = 0; i < numberOfPOI; i++) {
      if (POIs[i].getGoogleRate() > maxElement) {
        maxElement = POIs[i].getGoogleRate();
      }
    }
    return maxElement * maxNumberOfDestinations;
  }

  public double calcMaxWaitingTime() {
    double[] startTimeArray = new double[numberOfPOI];
    for (int i = 0; i < this.numberOfPOI; i++) {
      startTimeArray[i] = this.POIs[i].getOpenTime();
    }
    Arrays.sort(startTimeArray);
    double waitingTime = 0;
    for (int i = numberOfPOI - 1; i >= numberOfPOI - 1; i--) {
      waitingTime += startTimeArray[i] - dailyStartTime[0];
    }
    return waitingTime;
  }
}
