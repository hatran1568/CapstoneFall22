package entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="checklist_item")
public class ChecklistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="checklist_id",columnDefinition = "INT(1)")
    private int ticketId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "check")
    private boolean checked;

    @Column(name="content")
    private String content;
}
