package com.example.Optimizer.algorithms;

import com.example.Optimizer.DTO.Data;
import com.example.Optimizer.DTO.Solution;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;


public class GeneticAlgorithmImplementer {

    private SimpMessagingTemplate template;
    public Data data;

    public GeneticAlgorithmImplementer(Data data,SimpMessagingTemplate template) {
        this.template = template;
        this.data = data;
    }
    static int getNum(ArrayList<Integer> v) {
        // Size of the vector
        int n = v.size();

        // Make sure the number is within
        // the index range
        int index = (int) (Math.random() * n);

        // Get random number from the vector
        int num = v.get(index);

        // Remove the number from the vector
        v.set(index, v.get(n - 1));
        v.remove(n - 1);

        // Return the removed number
        return num;
    }

    // Function to generate n
    // non-repeating random numbers
    static ArrayList<Integer> generateRandom(int n) {
        ArrayList<Integer> v = new ArrayList<>(n);
        ArrayList<Integer> vc = new ArrayList<>(n);
        // Fill the vector with the values
        // 1, 2, 3, ..., n
        for (int i = 0; i < n; i++) {
            v.add(i);
        }
        for (int i = 0; i < n; i++) {
            vc.add(getNum(v));
        }
        // While vector has elements
        // get a random number from the vector and print it

        return vc;
    }

    // Driver code
    public Solution generatePopulation(Data data)  {

        ArrayList<Integer> fullTrip = generateRandom(data.getNumberOfPOI());
        Solution s = new Solution(data);
        for (int i = 0; i < data.getDayOfTrip(); i++) {
            ArrayList<Integer> dayTrip = new ArrayList<>();
            double time = Double.max(data.getDailyStartTime()[i], data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
            double cost = data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
            dayTrip.add(fullTrip.get(0));
            int current = fullTrip.get(0);
            fullTrip.remove(0);

            while (true) {

                if (Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration() < data.getDailyEndTime()[i]
                        && cost + data.getPOIs()[fullTrip.get(0)].getTypicalPrice() < data.getDailyBudget()[i]) {
                    time = Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
                    cost += data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
                    current = fullTrip.get(0);
                    dayTrip.add(fullTrip.get(0));
                    fullTrip.remove(0);

                } else {
                    break;
                }
            }
            s.gene.add(dayTrip);
        }
        return s;

    }

    public Solution crossover(Solution parent1, Solution parent2, Data data)  {
        Solution child = new Solution(data);
        Collection<Integer> set = new HashSet<Integer>();
        for (ArrayList<Integer> list : parent1.gene) {
            for (Integer i : list) {
                set.add(i);
            }

        }
        for (ArrayList<Integer> list : parent2.gene) {
            for (Integer i : list) {
                set.add(i);
            }

        }
        set = (Set<Integer>) newShuffledSet(set);

        ArrayList<Integer> fullTrip = new ArrayList<>(set);

        for (int i = 0; i < data.getDayOfTrip(); i++) {
            ArrayList<Integer> dayTrip = new ArrayList<>();
            double time = Double.max(data.getDailyStartTime()[i], data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
            double cost = data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
            dayTrip.add(fullTrip.get(0));
            int current = fullTrip.get(0);
            fullTrip.remove(0);

            while (fullTrip.size() > 0) {
                //double predict = Double.max(time + data.distanceOfPOI[current][fullTrip.get(0)] * 90, data.POIs[fullTrip.get(0)].getOpenTime()) + data.POIs[fullTrip.get(0)].getDuration();
                if (Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration() < data.getDailyEndTime()[i]
                        && cost + data.getPOIs()[fullTrip.get(0)].getTypicalPrice() < data.getDailyBudget()[i]) {
                    time = Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
                    cost += data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
                    current = fullTrip.get(0);
                    dayTrip.add(fullTrip.get(0));
                    fullTrip.remove(0);
                    continue;
                } else {
                    break;
                }
            }
            child.gene.add(dayTrip);
        }
        return child;
    }

    public Solution mutation(Solution s, Data data) {
        ArrayList<Integer> poiList = new ArrayList<>();
        for (int i = 0; i < data.getNumberOfPOI(); i++) {
            poiList.add(i);
        }

        // random trip number and cutoff point
        Random rand = new Random();
        int tripNumber = rand.nextInt(data.getDayOfTrip());
        int cutoffPoint = rand.nextInt(s.gene.get(tripNumber).size());
        //  System.out.println(tripNumber + "|" + cutoffPoint);
        Solution newS = new Solution(data);
        for (int i = 0; i < tripNumber; i++) {
            if (tripNumber != 0) {
                for (Integer poi : s.gene.get(i)) {
                    poiList.remove(poiList.indexOf(poi));
                }
                newS.gene.add(s.gene.get(i));
            }
        }
        ArrayList<Integer> newTrip = new ArrayList<>();
        double time = Double.max(data.getDailyStartTime()[tripNumber], data.getPOIs()[s.gene.get(tripNumber).get(0)].getOpenTime()) + data.getPOIs()[s.gene.get(tripNumber).get(0)].getDuration();;
        double cost = data.getPOIs()[s.gene.get(tripNumber).get(0)].getTypicalPrice();
        for (int i = 0; i < cutoffPoint; i++) {
            int currentPOI = s.gene.get(tripNumber).get(i);
            newTrip.add(currentPOI);
            poiList.remove(poiList.indexOf(currentPOI));
            time = Double.max(time + data.getDistanceOfPOI()[currentPOI][s.gene.get(tripNumber).get(i + 1)] * 90, data.getPOIs()[s.gene.get(tripNumber).get(i + 1)].getOpenTime()) + data.getPOIs()[s.gene.get(tripNumber).get(i + 1)].getDuration();
            cost += data.getPOIs()[s.gene.get(tripNumber).get(i)].getTypicalPrice();
        }

        int current = s.gene.get(tripNumber).get(cutoffPoint);
        newTrip.add(current);
        poiList.remove(poiList.indexOf(current));

        ArrayList<Integer> fullTrip = new ArrayList<>();
        int size = poiList.size();
        for (int i = 0; i < size; i++) {
            fullTrip.add(getNum(poiList));
        }
        while (fullTrip.size() > 0) {
            //double predict = Double.max(time + data.D[current][fullTrip.get(0)] * 90, data.MyPOI[fullTrip.get(0)].getStart()) + data.MyPOI[fullTrip.get(0)].getDuration();
            if (Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration() < data.getDailyEndTime()[tripNumber]
                    && cost + data.getPOIs()[fullTrip.get(0)].getTypicalPrice() < data.getDailyBudget()[tripNumber]) {
                time = Double.max(time + data.getDistanceOfPOI()[current][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
                cost += data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
                current = fullTrip.get(0);
                newTrip.add(fullTrip.get(0));
                fullTrip.remove(0);
                continue;
            } else {
                break;
            }
        }

        newS.gene.add(newTrip);

        for (int i = tripNumber + 1; i < data.getDayOfTrip(); i++) {
            ArrayList<Integer> dayTrip = new ArrayList<>();
            double newTime = Double.max(data.getDailyStartTime()[i], data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
            double newCost = data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
            dayTrip.add(fullTrip.get(0));
            int currentPOI = fullTrip.get(0);
            fullTrip.remove(0);
            while (fullTrip.size() > 0) {
                //double predict = Double.max(newTime + data.D[currentPOI][fullTrip.get(0)] * 90, data.MyPOI[fullTrip.get(0)].getStart()) + data.MyPOI[fullTrip.get(0)].getDuration();
                if (!(Double.max(newTime + data.getDistanceOfPOI()[currentPOI][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration() >= data.getDailyEndTime()[i]
                        || newCost + data.getPOIs()[fullTrip.get(0)].getTypicalPrice() >= data.getDailyBudget()[i])) {
                    newTime = Double.max(newTime + data.getDistanceOfPOI()[currentPOI][fullTrip.get(0)] * 90, data.getPOIs()[fullTrip.get(0)].getOpenTime()) + data.getPOIs()[fullTrip.get(0)].getDuration();
                    newCost += data.getPOIs()[fullTrip.get(0)].getTypicalPrice();
                    currentPOI = fullTrip.get(0);
                    dayTrip.add(fullTrip.get(0));
                    fullTrip.remove(0);
                    continue;
                } else {
                    break;
                }
            }
            newS.gene.add(dayTrip);
        }
        return newS;
    }

    public Solution mutation2(Solution s, Data data){
        Solution newS = new Solution(data);

        return generatePopulation(data);
    }

    public Solution implementGA(Data data){
        ArrayList<Solution> results = new ArrayList<>();
        ArrayList<Solution> population = new ArrayList<>();
        //Generation
        for (int i = 0; i < 6000; i++) {
            population.add(generatePopulation(data));
        }
        Collections.sort(population, new Comparator<Solution>() {
            @Override
            public int compare(Solution o1, Solution o2) {

                return Double.compare(o1.cal_fitness(), o2.cal_fitness());
            }
        });
        for (int j = 1; j <= 300; j++) {
            if(j%3==0){
               template.convertAndSendToUser(String.valueOf(data.getUserId()),"/chatroom",String.valueOf(j/3));
        }

            //Selection

            ArrayList<Solution> nextPopulation = new ArrayList<>();
            for (int i = 0; i < 600; i++) {
                nextPopulation.add(population.get(i));
            }
            //Crossover
            for (int i = 0; i < 5400; i++) {
                Random rand = new Random();
                int mom = rand.nextInt(6000);
                int dad = rand.nextInt(6000);
                while (mom == dad) {
                    dad = rand.nextInt(6000);
                }
                //nextPopulation.add(crossover(population.get(dad), population.get(mom), data));
                nextPopulation.add(mutation(population.get(mom), data));
            }
            Collections.sort(nextPopulation, new Comparator<Solution>() {
                @Override
                public int compare(Solution o1, Solution o2) {

                    return Double.compare(o1.cal_fitness(), o2.cal_fitness());
                }
            });

            //mutation
            for (int i = 0; i < 600; i++) {
                Random rand = new Random();
                int choosen = rand.nextInt(5700);
                choosen += 300;
                nextPopulation.set(choosen, mutation2(nextPopulation.get(choosen), data));
            }
            Collections.sort(nextPopulation, new Comparator<Solution>() {
                @Override
                public int compare(Solution o1, Solution o2) {

                    return Double.compare(o1.cal_fitness(), o2.cal_fitness());
                }
            });
            results.add(nextPopulation.get(0));
            population.clear();
            population = new ArrayList<>(nextPopulation);
        }

        return results.get(0);
    }

    public static <T> Set<T> newShuffledSet(Collection<T> collection) {
        List<T> shuffleMe = new ArrayList<T>(collection);
        Collections.shuffle(shuffleMe);
        return new HashSet<T>(shuffleMe);
    }
}
