package entity;


import lombok.Data;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Data
@Entity
@Table(name="day_of_trip")
public class DayOfTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="day_id",columnDefinition = "INT(1)")
    private int dayId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name="date")
    private Date date  ;

    @Column(name="number")
    private int number;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "dayOfTrip", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})

    private List<POIOfDay> listPOIs;
}
