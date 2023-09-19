package com.tripplanner.BlogService.repository;

import com.tripplanner.BlogService.dto.response.AdminCountItemDTO;
import com.tripplanner.BlogService.dto.response.AdminRatingTop3DTO;
import com.tripplanner.BlogService.dto.response.AdminTopPoiDTO;
import com.tripplanner.BlogService.entity.Blog;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminRepository extends JpaRepository<Blog, Integer> {
  @Query(
    value = "SELECT (SELECT COUNT(*) FROM user) as users, (SELECT COUNT(*) FROM destination) as destinations,\n" +
    "       (SELECT COUNT(*) FROM poi) as pois, (SELECT COUNT(*) FROM trip) as trips,\n" +
    "       (SELECT COUNT(*) FROM request) as requests, (SELECT COUNT(*) FROM blog) as blogs",
    nativeQuery = true
  )
  AdminCountItemDTO getCountAll();

  @Query(
    value = "SELECT COUNT(*) FROM trip WHERE date_created >= ?1 AND date_created < ?2\n",
    nativeQuery = true
  )
  int getTripCountByDay(String x, String y);

  @Query(
    value = "SELECT COUNT(*) FROM user WHERE date_created >= ?1 AND date_created < ?2 AND provider = ?3\n",
    nativeQuery = true
  )
  int getUserCountByDay(String x, String y, String z);

  @Query(
    value = "SELECT DISTINCT ma.name, (SELECT AVG(rate) FROM rating WHERE poi_id = ma.activity_id) as rating,\n" +
    "                (SELECT COUNT(*) FROM rating WHERE poi_id = ma.activity_id) as count\n" +
    "FROM rating r LEFT JOIN master_activity ma on r.poi_id = ma.activity_id\n" +
    "ORDER BY rating DESC LIMIT 3",
    nativeQuery = true
  )
  ArrayList<AdminRatingTop3DTO> getTopRating();

  @Query(
    value = "SELECT DISTINCT ma.name, (SELECT AVG(rate) FROM rating WHERE poi_id = ma.activity_id) as rating,\n" +
    "                (SELECT COUNT(*) FROM rating WHERE poi_id = ma.activity_id) as count\n" +
    "FROM rating r LEFT JOIN master_activity ma on r.poi_id = ma.activity_id\n" +
    "ORDER BY count DESC LIMIT 3",
    nativeQuery = true
  )
  ArrayList<AdminRatingTop3DTO> getTopRatingCount();

  @Query(
    value = "SELECT COUNT(*) FROM poi WHERE category_id = 10",
    nativeQuery = true
  )
  int getHotelCount();

  @Query(
    value = "SELECT COUNT(*) FROM poi WHERE category_id <> 10",
    nativeQuery = true
  )
  int getPOICount();

  @Query(
    value = "SELECT DISTINCT ma.name, (SELECT url FROM poi_image WHERE poi_id = td.master_activity_id LIMIT 1) as img,\n" +
    "                (SELECT COUNT(*) FROM trip_details WHERE master_activity_id = ma.activity_id) as count\n" +
    "FROM trip_details td LEFT JOIN master_activity ma on td.master_activity_id = ma.activity_id\n" +
    "ORDER BY count DESC LIMIT 5",
    nativeQuery = true
  )
  ArrayList<AdminTopPoiDTO> getTopPOI();

  @Query(
    value = "SELECT COUNT(*) FROM rating WHERE rate = ?1",
    nativeQuery = true
  )
  int getRatingCount(int rate);
}
