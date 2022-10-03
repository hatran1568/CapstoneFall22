package repository;

import entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;


@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {
    Optional<Trip> findById(int id);
    ArrayList<Trip> getTripsByUser(String email);

}
