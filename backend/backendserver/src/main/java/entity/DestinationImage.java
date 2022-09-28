package entity;


import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="destination_image")
public class DestinationImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="image_id",columnDefinition = "INT(1)")
    private int imageId;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name="url")
    private String URL;


    @Column(name="description")
    private String description;
}
