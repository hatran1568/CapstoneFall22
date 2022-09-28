package entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="poi_of_day")
public class POIOfDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id",columnDefinition = "INT(1)")
    private int id;

    @ManyToOne
    @JoinColumn(name = "day_id", nullable = false)
    private DayOfTrip dayOfTrip;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false)
    private POI poi;

    @Column(name = "start_time")
    private  int startTime;

    @Column(name="end_time")
    private  int endTime;

    @Column(name="number")
    private int number;
}
