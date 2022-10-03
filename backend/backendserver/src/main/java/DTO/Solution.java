package DTO;

import entity.DayOfTrip;
import entity.POIOfDay;
import entity.Trip;

import java.sql.Date;
import java.util.ArrayList;

public class Solution {
    private Date startDate;
    private Date endDate;
    private AlgorithmData data;
    public ArrayList<ArrayList<Integer>> gene;
    public Solution(AlgorithmData data) {
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
            for (int j = 0; j < this.gene.get(i).size() - 1; j++) {
                distance += data.getDistanceOfPOI()[this.gene.get(i).get(j)][this.gene.get(i).get(j + 1)];
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
            double current_time = data.getDailyStartTime()[i] + data.getPOIs()[this.gene.get(i).get(0)].getDuration();
            for (int j = 1; j < this.gene.get(i).size(); j++) {
                if (current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90 < data.getPOIs()[this.gene.get(i).get(j)].getOpenTime()) {
                    waiting_time += data.getPOIs()[this.gene.get(i).get(j)].getOpenTime() - current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90;

                }
                current_time = Double.max(current_time + data.getDistanceOfPOI()[this.gene.get(i).get(j - 1)][this.gene.get(i).get(j)] * 90, data.getPOIs()[this.gene.get(i).get(j)].getOpenTime()) + data.getPOIs()[this.gene.get(i).get(j)].getDuration();
            }
        }
        return waiting_time;
    }


    public double cal_fitness() {



        double fitness = 0;
        fitness += Math.pow((cal_distance_obj() - data.getMinDistance()) / (data.getMaxDistance() - data.getMinDistance()), 2) * data.getW1();
        fitness += Math.pow((data.getMinWaitingTime() - cal_waiting_time_obj()) / (data.getMaxWaitingTime() - data.getMinWaitingTime()), 2) * data.getW2();
        fitness += Math.pow((cal_hapiness_obj() - data.getMaxHappiness()) / (data.getMaxHappiness() - data.getMinHappiness()), 2) * data.getW3();
        fitness += Math.pow((cal_number_of_destination_obj() - data.getMaxNumberOfDestinations()) / (data.getMinNumberOfDestinations() - data.getMinNumberOfDestinations()), 2) * data.getW4();
        fitness = Math.sqrt(fitness);
        return fitness;
    }

    public Trip toTrip(AlgorithmData data){
        Trip tour = new Trip();
        Date currentDay = data.getStartDate();
        int index =1;
        ArrayList<DayOfTrip> days = new ArrayList<>();
        for (ArrayList<Integer> list:gene) {
            DayOfTrip day = new DayOfTrip();
            ArrayList<POIOfDay> pois = new ArrayList<>();
            day.setDate(currentDay);
            currentDay = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24));
            day.setNumber(index);
            index++;
            int currentTime = (int) data.getDailyStartTime()[index-2];
            for(int i=0;i<list.size();i++){
                POIOfDay poi = new POIOfDay();
                poi.setPoi(data.getPOIs()[list.get(i)]);
                poi.setStartTime((int) Math.max(currentTime,poi.getPoi().getOpenTime()));
                currentTime = (int) ((int) Math.max(currentTime,poi.getPoi().getOpenTime()) + poi.getPoi().getDuration());
                poi.setEndTime(currentTime);
                poi.setNumber(i+1);
                if(i!=list.size()-1){
                    currentTime+= data.getDistanceOfPOI()[list.get(i)][list.get(i+1)] * 90;
                }
                pois.add(poi);
            }
            day.setListPOIs(pois);
            days.add(day);

        }
        tour.setNumberOfDays(data.getDayOfTrip());

        tour.setListDays(days);

        return tour;

    }


}
