package com.tripplanner.LocationService.controller;

import com.tripplanner.LocationService.dto.request.GalleryImages;
import com.tripplanner.LocationService.dto.request.POIBoxDTO;
import com.tripplanner.LocationService.dto.request.POIDesRequestDTO;
import com.tripplanner.LocationService.dto.request.UpdateDesDTO;
import com.tripplanner.LocationService.dto.response.*;
import com.tripplanner.LocationService.entity.Destination;
import com.tripplanner.LocationService.repository.DestinationRepository;

import com.tripplanner.LocationService.service.interfaces.DestinationService;
import com.tripplanner.LocationService.utils.GoogleDriveManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/location/api")
public class DestinationController {

    @Autowired
    private DestinationRepository destinationRepo;
    @Autowired
    GoogleDriveManager driveManager;
    @Autowired
    DestinationService destinationService;
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/destination/thumbnail/{id}")
    public ResponseEntity<String> getThumbnailById(@PathVariable int id){
        try{
            Optional<String> thumbnail = destinationRepo.getThumbnailById(id);
            String result = thumbnail.isPresent()?thumbnail.get():null;
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @GetMapping("/destination/get-destination-3")
    public ResponseEntity<List<DestinationGeneralDTO>> get3Destinations(){
        try{
            List<DestinationGeneralDTO> destinations = destinationService.get3Destinations();
            return new ResponseEntity<>(destinations, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
  @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/destination/poi/update/{poiId}", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> updateDesOfPOI(@RequestBody ArrayList<POIDesRequestDTO> poides, @PathVariable("poiId") int poiId) {
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @RequestMapping(value = "/destination/delete/{desId}", consumes = "application/json", method = RequestMethod.POST)
    public ResponseEntity<?> deleteDes(@PathVariable int desId) {
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
   @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/update/{desId}")
    public ResponseEntity<DesAddUpdateDTO> getDesUpdate(@PathVariable("desId") int desId) {
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/destination/admin/list/update/images/{desId}")
    public ResponseEntity<ArrayList<POIImageUpdateDTO>> getDesImageUpdate(@PathVariable("desId") int desId) {
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
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @RequestMapping(value = "/destination/add", consumes = "application/json", produces = { "*/*" }, method = RequestMethod.POST)
    public ResponseEntity<?> addDes(@RequestBody UpdateDesDTO destination) {
        try{
            java.sql.Timestamp date = new java.sql.Timestamp(Calendar.getInstance().getTime().getTime());
            destinationRepo.addDes(destination.getName(), destination.getDescription(),
                    date, date, false, destination.getBelongTo());
            return new ResponseEntity<>(destinationRepo.getLatestDes(), HttpStatus.OK);
        }
        catch (Exception e){
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    @PreAuthorize("hasAuthority('Admin')")
    @PostMapping("/destination/addImg/{desId}/{description}")
    @ResponseBody
    public ResponseEntity<?> addImage(@PathVariable int desId, @PathVariable String description, @RequestPart("File") MultipartFile file) throws Exception{
        try{
        String webViewLink = driveManager.uploadFile(file, "tripplanner/img/destination");
        if (description.equals("*"))
            destinationRepo.addImage(desId, null, webViewLink);
        else
            destinationRepo.addImage(desId, description, webViewLink);
        return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
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
