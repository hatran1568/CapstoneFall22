package entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="rating")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="request_id",columnDefinition = "INT(1)")
    private int requestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false,unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "poi_id", nullable = false,unique = true)
    private POI POI;

    @JoinColumn(name = "rate")
    private int rate;

    @JoinColumn(name = "comment")
    private String Comment;


}
