package com.planner.backendserver.controller;

import com.planner.backendserver.DTO.request.*;
import com.planner.backendserver.DTO.response.*;
import com.planner.backendserver.entity.Destination;
import com.planner.backendserver.repository.DestinationRepository;
import com.planner.backendserver.service.UserDTOServiceImplementer;
import com.planner.backendserver.utils.GoogleDriveManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Calendar;

@RestController
@RequestMapping("/api")
public class DestinationController {
    @Autowired
    private UserDTOServiceImplementer userDTOService;
    @Autowired
    private DestinationRepository destinationRepo;
    @Autowired
    GoogleDriveManager driveManager;

    @GetMapping("/destination/{id}")
    public ResponseEntity<DesDetailsDTO> getDestinationById(@PathVariable int id){
        try{
            DesDetailsDTO destination = destinationRepo.getDestinationById(id);
            if (destination == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(destination, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/destination/all")
    public ResponseEntity<ArrayList<Destination>> getAllDes(){
        try{
            ArrayList<Destination> destinations = destinationRepo.getAllDes();
            if (destinations.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/destination/first3POIs/{id}")
    public ResponseEntity<ArrayList<POIBoxDTO>> get3POIinDestination(@PathVariable int id){
        try{
            ArrayList<POIBoxDTO> POIs = destinationRepo.get3FirstPOIofDestination(id);
            if (POIs.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(POIs, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/destination/images/{id}")
    public ResponseEntity<ArrayList<GalleryImages>> getDestinationImages(@PathVariable int id){
        try{
            ArrayList<GalleryImages> images = destinationRepo.getDestinationImagesURL(id);
            if (images.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/{filter}/{nameKey}/{page}")
    public ResponseEntity<ArrayList<DesListDTO>> getDesListAdmin(@PathVariable("filter") String filter, @PathVariable("page") int page, @PathVariable("nameKey") String nameKey) {
        try {
            ArrayList<DesListDTO> destinations;
            if (nameKey.equals("*"))
                nameKey = "";
            destinations = destinationRepo.getDesListAdmin(filter, nameKey, page*30, 30);
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/{nameKey}/count")
    public ResponseEntity<Integer> getDesListAdminCount(@PathVariable("nameKey") String nameKey) {
        try {
            int count;
            if (nameKey.equals("*"))
                nameKey = "";
            count = destinationRepo.getDesListAdminCount(nameKey);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/select/all")
    public ResponseEntity<ArrayList<DesSelectDTO>> getAllDesSelect() {
        try {
            ArrayList<DesSelectDTO> destinations;
            destinations = destinationRepo.getAllDesSelect();
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/select/{poiId}")
    public ResponseEntity<ArrayList<DesSelectDTO>> getDesSelectOfPOI(@PathVariable("poiId") int poiId) {
        try {
            ArrayList<DesSelectDTO> destinations;
            destinations = destinationRepo.getAllDesOfPOI(poiId);
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/destination/poi/update/{poiId}", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateExpense(@RequestBody ArrayList<POIDesRequestDTO> poides, @PathVariable("poiId") int poiId) {
        try{
            if (poides.get(0).getValue() == 0)
                return new ResponseEntity<>(HttpStatus.OK);
            destinationRepo.deleteAllPOIDes(poiId);
            for (POIDesRequestDTO entry : poides)
            {
                destinationRepo.addPOIDes(poiId, entry.getValue());
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @RequestMapping(value = "/destination/delete/{desId}", consumes = "application/json", method = RequestMethod.POST)
    public ResponseEntity<?> deletePOI(@PathVariable int desId) {
        try{
            if (destinationRepo.getDestinationById(desId) == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            destinationRepo.deleteDes(desId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/update/{desId}")
    public ResponseEntity<DesAddUpdateDTO> getDesListAdmin(@PathVariable("desId") int desId) {
        try {
            DesAddUpdateDTO destination = destinationRepo.getDesUpdate(desId);
            if (destination == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(destination, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/update/images/{desId}")
    public ResponseEntity<ArrayList<POIImageUpdateDTO>> getPOIImageUpdate(@PathVariable("desId") int desId) {
        try {
            ArrayList<POIImageUpdateDTO> images = destinationRepo.getDesImagesUpdate(desId);
            if (images.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/destination/update", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateDes(@RequestBody UpdateDesDTO destination) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            destinationRepo.updateDes(destination.getDesId(), destination.getName(), destination.getDescription(), date, destination.getBelongTo());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/destination/add", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> addPOI(@RequestBody UpdateDesDTO destination) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            destinationRepo.addDes(destination.getName(), destination.getDescription(),
                    date, date, false, destination.getBelongTo());
            return new ResponseEntity<>(destinationRepo.getLastestDes(), HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PreAuthorize("hasAuthority('Admin')")
    @PostMapping("/destination/addImg/{desId}/{description}")
    @ResponseBody
    public ResponseEntity<?> addImage(@PathVariable int desId, @PathVariable String description, @RequestPart("File") MultipartFile file) throws Exception{
//        try{
        String webViewLink = driveManager.uploadFile(file, "tripplanner/img/destination");
        if (description.equals("*"))
            destinationRepo.addImage(desId, null, webViewLink);
        else
            destinationRepo.addImage(desId, description, webViewLink);
        return new ResponseEntity<>(HttpStatus.OK);
//        } catch (Exception e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
    }
    @RequestMapping(value = "/destination/deleteImg/{imgId}", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> deleteImg(@PathVariable int imgId){
        try{
            String oldAvatar = destinationRepo.getUrlDesImage(imgId);
            if (oldAvatar != null){
                driveManager.deleteFile(oldAvatar.split("id=")[1]);
            }
            destinationRepo.deleteImage(imgId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
