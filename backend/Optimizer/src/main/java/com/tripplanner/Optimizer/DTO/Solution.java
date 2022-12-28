package com.tripplanner.Optimizer.DTO;

import java.sql.Date;
import java.util.ArrayList;

public class Solution {
    
    private Data data;
    public ArrayList<ArrayList<Integer>> gene;
    public Solution(Data data) {
        this.data = data;
        gene = new ArrayList<>();
    }

    public boolean isValid(ArrayList<ArrayList<Integer>> gene) {
        boolean isStartEndTimeValid = true;
        double[][] A = new double[500][data.getNumberOfPOI()];
        for (int i = 0; i < data.getNumberOfPOI(); i++) {
            ArrayList<Integer> trip = gene.get(i);
            for (int j = 0; j < trip.size(); j++) {
                int poi = trip.get(j);
                if (j == 0) {
                    A[j][i] = data.getDailyStartTime()[i] + data.getPOIs()[poi].getDuration();
                } else {
                    A[j][i] = A[j - 1][i] + data.getPOIs()[poi].getDuration();
                }
                if (A[j][i] >= data.getPOIs()[poi].getCloseTime() || A[j][i] - data.getPOIs()[poi].getDuration() <= data.getPOIs()[poi].getOpenTime()) {
                    isStartEndTimeValid = false;
                }
            }
        }

        return isStartEndTimeValid;
    }

    public double cal_hapiness_obj() {
        double happiness = 0;
        for (ArrayList<Integer> arrayList : gene) {
            for (Integer index : arrayList) {
                happiness += data.getPOIs()[index].getGoogleRate();
            }
        }
        return happiness;
    }

    public double cal_distance_obj() {
        double distance = 0;
        for (int i = 0; i < data.getDayOfTrip(); i++) {
            if(this.gene.get(i).size()>1){
                for (int j = 0; j < this.gene.get(i).size() - 1; j++) {
                    distance += data.getDistanceOfPOI()[this.gene.get(i).get(j)][this.gene.get(i).get(j + 1)];
                }
            }

        }
        return distance;
    }

    public double cal_number_of_destination_obj() {
        double number = 0;
        for (ArrayList<Integer> arrayList : gene) {
            number += arrayList.size();
        }
        return number;
    }

    public double cal_waiting_time_obj() {
        double waiting_time = 0;
        for (int i = 0; i < data.getDayOfTrip(); i++) {
            if(this.gene.get(i).size()>0){
                double current_time = data.getDailyStartTime()[i] + data.getPOIs()[this.gene.get(i).get(0)].getDuration();
                for (int j = 1; j < this.gene.get(i).size(); j++) {
                    if (current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90 < data.getPOIs()[this.gene.get(i).get(j)].getOpenTime()) {
                        waiting_time += data.getPOIs()[this.gene.get(i).get(j)].getOpenTime() - current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90;

                    }
                    current_time = Double.max(current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90, data.getPOIs()[this.gene.get(i).get(j)].getOpenTime()) + data.getPOIs()[this.gene.get(i).get(j)].getDuration();
                }
            }

        }
        return waiting_time;
    }


    public double cal_fitness() {



        double fitness = 0;
        fitness += Math.pow((cal_distance_obj() - data.getMinDistance()) / (data.getMaxDistance() - data.getMinDistance()), 2) * data.getW1();
        fitness += Math.pow((data.getMinWaitingTime() - cal_waiting_time_obj()) / (data.getMaxWaitingTime() - data.getMinWaitingTime()), 2) * data.getW2();
        fitness += Math.pow((cal_hapiness_obj() - data.getMaxHappiness()) / (data.getMaxHappiness() - data.getMinHappiness()), 2) * data.getW3();
        fitness += Math.pow((cal_number_of_destination_obj() - data.getMaxNumberOfDestinations()) / (data.getMaxNumberOfDestinations() - data.getMinNumberOfDestinations()), 2) * data.getW4();
        fitness = Math.sqrt(fitness);
        return fitness;
    }

    public Trip toTrip(Data data){
        Trip tour = new Trip();
        Date currentDay = data.getStartDate();
        int index =1;
        ArrayList<TripDetails> days = new ArrayList<>();
        for (ArrayList<Integer> list:gene) {
                double currentTime = data.getDailyStartTime()[index-1];
            for(int i=0;i<list.size();i++){
                TripDetails tripDetails = new TripDetails();
                tripDetails.setDayNumber(index);
                MasterActivity activity = new MasterActivity();
                activity = data.getPOIs()[list.get(i)];
                tripDetails.setMasterActivity(activity);
                tripDetails.setStartTime((int) Math.max(currentTime,((POI) tripDetails.getMasterActivity()).getOpenTime())) ;
                currentTime = (int) ((int) Math.max(currentTime,((POI) tripDetails.getMasterActivity()).getOpenTime()) +((POI) tripDetails.getMasterActivity()).getDuration());
                tripDetails.setEndTime((int) currentTime);
                if(i!=list.size()-1){
                    currentTime+= data.getDistanceOfPOI()[list.get(i)][list.get(i+1)] * 270;
                }
                days.add(tripDetails);
            }
            index++;
            currentDay =new Date(currentDay.getTime() + 86400000);
        }
        tour.setListTripDetails(days);



        return tour;

    }
}
