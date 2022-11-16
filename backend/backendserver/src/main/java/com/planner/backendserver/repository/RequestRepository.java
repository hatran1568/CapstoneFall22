package com.planner.backendserver.repository;

import com.planner.backendserver.DTO.request.POIListDTO;
import com.planner.backendserver.DTO.request.POIofDestinationDTO;

import java.awt.*;
import java.sql.Timestamp;
import java.util.ArrayList;

import com.planner.backendserver.DTO.response.POIImageUpdateDTO;
import com.planner.backendserver.DTO.response.POIUpdateDTO;
import com.planner.backendserver.DTO.response.RequestDetailsDTO;
import com.planner.backendserver.DTO.response.RequestListDTO;
import com.planner.backendserver.entity.MasterActivity;
import com.planner.backendserver.entity.POI;
import com.planner.backendserver.entity.Rating;
import com.planner.backendserver.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {

    @Query(
            value = "SELECT r.request_id as requestId, r.date_modified as modified, r.date_created as created, r.user_id as userId, u.name as username,\n" +
                    "       u.avatar, r.poi_id as poiId, ma.name as poiName, r.status\n" +
                    "FROM request r LEFT JOIN master_activity ma ON r.poi_id = ma.activity_id\n" +
                    "               LEFT JOIN user u ON r.user_id = u.user_id\n" +
                    "WHERE ma.name LIKE CONCAT('%',?2,'%')\n" +
                    "ORDER BY\n" +
                    "(CASE\n" +
                    "    WHEN (?1 = 'poiDESC') THEN ma.activity_id\n" +
                    "    WHEN (?1 = 'dateDESC') THEN r.date_modified\n" +
                    "END\n" +
                    ") DESC,\n" +
                    "(CASE\n" +
                    "    WHEN (?1 = 'poiASC') THEN ma.activity_id\n" +
                    "    WHEN (?1 = 'dateASC') THEN r.date_modified\n" +
                    "END\n" +
                    ") ASC\n" +
                    "LIMIT ?3, ?4",
            nativeQuery = true)
    ArrayList<RequestListDTO> getEditRequestList(String filter, String nameKeyword, int page, int skip);

    @Query(
            value = "SELECT COUNT(*)\n" +
                    "FROM request r LEFT JOIN master_activity ma ON r.poi_id = ma.activity_id\n" +
                    "WHERE ma.name LIKE CONCAT('%',?1,'%')\n",
            nativeQuery = true)
    int getEditRequestListCount(String nameKeyword);
    @Query(
            value = "SELECT IF(address IS NULL, '*', address) as address, IF(additional_information IS NULL, '*', additional_information) as info,\n" +
                    "       IF(description IS NULL, '*', description) as description, IF(business_email IS NULL, '*', business_email) as email, IF(closing_time IS NULL, '-1', closing_time) as close,\n" +
                    "       IF(opening_time IS NULL, '-1', opening_time) as open, IF(duration IS NULL, '-1', duration) as duration,\n" +
                    "       IF(name IS NULL, '*', name) as name, IF(telephone_number IS NULL, '*', telephone_number) as phone,\n" +
                    "       IF(typical_price IS NULL, '-1', typical_price) as price, IF(website IS NULL, '*', website) as website\n" +
                    "FROM request WHERE request_id = ?1",
            nativeQuery = true)
    RequestDetailsDTO getEditRequestDetails(int reqId);
    @Query(
            value = "SELECT url FROM request_attachment WHERE request_id = ?1",
            nativeQuery = true)
    ArrayList<String> getRequestImages(int reqId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE request\n" +
                    "SET status = 'ACCEPTED'\n" +
                    "WHERE request_id = ?1",
            nativeQuery = true)
    void approveBlog(int reqId);
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE request\n" +
                    "SET status = 'REJECTED'\n" +
                    "WHERE request_id = ?1",
            nativeQuery = true)
    void rejectBlog(int reqId);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO request(name, address, description, additional_information, business_email, telephone_number,\n" +
                    "                    date_modified, date_created, closing_time, opening_time, duration, typical_price, website,\n" +
                    "                    poi_id, user_id, status)\n" +
                    "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16)",
            nativeQuery = true)
    void newRequest(String name, String address, String desc, String info, String email, String phone, Timestamp modified, Timestamp created, int close, int open, int duration, double price, String web, int poiId, int userId, String status);
    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO request_attachment(url, request_id) VALUES (?2, ?1)",
            nativeQuery = true)
    void addRequestImage(int reqId, String url);
    @Query(
            value = "SELECT request_id FROM request ORDER BY request_id DESC LIMIT 1",
            nativeQuery = true)
    int getNewestRequest();
}
