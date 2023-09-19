package com.planner.backendserver.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.planner.backendserver.DTO.response.UserListDTO;
import com.planner.backendserver.dto.request.ChangePwdRequestDTO;
import com.planner.backendserver.dto.request.PasswordResetRequestDTO;
import com.planner.backendserver.repository.UserRepository;
import com.planner.backendserver.service.interfaces.UserService;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired
  private UserRepository userRepo;

  @Autowired
  private UserService userService;

  @GetMapping("/findById/{id}")
  public ResponseEntity<?> getUserById(@PathVariable int id) {
    if (userService.getUserProfileById(id) == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(
      userService.getUserProfileById(id),
      HttpStatus.OK
    );
  }

  @PostMapping("/edit-avatar/{userId}")
  public ResponseEntity<?> updateAvatar(
    @PathVariable int userId,
    @RequestPart("File") MultipartFile file
  ) {
    try {
      if (userService.getUserProfileById(userId) == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      String oldAvatar = userService.editAvatar(userId, file);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/edit-username")
  public ResponseEntity<?> updateUsername(@RequestBody ObjectNode request) {
    try {
      int id = request.get("id").asInt();
      String newName = request.get("username").asText();
      if (userService.getUserProfileById(id) == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      userService.editUsername(id, newName);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/edit-password")
  public ResponseEntity<?> updatePassword(
    @RequestBody ChangePwdRequestDTO request
  ) {
    try {
      if (userService.getUserProfileById(request.getId()) == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      boolean result = userService.editPassword(request);
      if (result == false) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      } else {
        return new ResponseEntity<>(HttpStatus.OK);
      }
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/password-reset-request")
  public ResponseEntity<?> requestResetPassword(@RequestBody String email) {
    try {
      boolean result = userService.requestPasswordReset(email);
      if (result) {
        return new ResponseEntity<>(HttpStatus.OK);
      }
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/password-reset")
  public ResponseEntity<?> resetPassword(
    @RequestBody PasswordResetRequestDTO request
  ) {
    try {
      boolean result = userService.handleResetPasswordToken(request);
      if (result) {
        return new ResponseEntity<>(HttpStatus.OK);
      }
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @GetMapping("/list/admin/{filter}/{nameKey}/{page}")
  public ResponseEntity<ArrayList<UserListDTO>> getUserListAdmin(
    @PathVariable("filter") String filter,
    @PathVariable("page") int page,
    @PathVariable("nameKey") String nameKey
  ) {
    try {
      ArrayList<UserListDTO> users;
      if (nameKey.equals("*")) nameKey = "";
      users = userRepo.getUserList(filter, nameKey, page * 30, 30);
      return new ResponseEntity<>(users, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @GetMapping("/list/count/{nameKey}")
  public ResponseEntity<Integer> getPOIListAdminCount(
    @PathVariable("nameKey") String nameKey
  ) {
    try {
      int count;
      if (nameKey.equals("*")) nameKey = "";
      count = userRepo.getUserListAdminCount(nameKey);
      return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @RequestMapping(
    value = "/activate/{userId}",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> activateUser(@PathVariable int userId) {
    try {
      userRepo.activateUser(userId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @RequestMapping(
    value = "/deactivate/{userId}",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> deactivateUser(@PathVariable int userId) {
    try {
      userRepo.deactivateUser(userId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAuthority('Admin')")
  @RequestMapping(
    value = "/delete/{userId}",
    produces = { "*/*" },
    method = RequestMethod.POST
  )
  public ResponseEntity<?> deleteUser(@PathVariable int userId) {
    try {
      userRepo.deleteUser(userId);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
