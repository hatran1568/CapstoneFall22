package entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="role_id",columnDefinition = "INT(1)")
    private int roleID;

    @Column(name = "role_name")
    private String roleName;


}
