package com.tripplanner.TripService.service.implementers;

import static org.mockito.Mockito.*;

import com.tripplanner.TripService.dto.response.ChecklistDTO;
import com.tripplanner.TripService.dto.response.ChecklistItemDTO;
import com.tripplanner.TripService.entity.ChecklistItem;
import com.tripplanner.TripService.entity.Trip;
import com.tripplanner.TripService.repository.ChecklistItemRepository;
import com.tripplanner.TripService.repository.TripRepository;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class ChecklistServiceImplTest {

  @Autowired
  private ChecklistServiceImpl service;

  @MockBean
  private TripRepository tripRepo;

  @MockBean
  private ChecklistItemRepository checklistItemRepo;

  @Nested
  class GetChecklistItemsByTripIdTest {

    @Test
    void existingItemCase() {
      Trip trip = new Trip();
      trip.setTripId(1);
      trip.setUser(1);
      doReturn(trip).when(tripRepo).findDetailedTripById(1, 1);
      ChecklistItem checklistItem = new ChecklistItem();
      checklistItem.setItemId(1);
      checklistItem.setTrip(trip);
      ArrayList<ChecklistItem> list = new ArrayList<>();
      list.add(checklistItem);
      doReturn(list).when(checklistItemRepo).getByTripId(1);

      ChecklistDTO returned = service.getChecklistItemsByTripId(1, 1);

      Assertions.assertEquals(returned.getChecklistItems().size(), 1);
    }

    @Test
    void nonExistingCase() {
      doReturn(null).when(tripRepo).findDetailedTripById(1, 1);

      ChecklistDTO returned = service.getChecklistItemsByTripId(1, 1);

      Assertions.assertNull(returned);
    }
  }

  @Test
  void itemExistsTest() {
    boolean returned = service.itemExists(1);

    Assertions.assertFalse(returned);
  }

  @Test
  void updateCheckedStateTest() {
    doNothing().when(checklistItemRepo).updateCheckedState(1, true);

    service.updateCheckedState(1, true);

    verify(checklistItemRepo, times(1)).updateCheckedState(1, true);
  }

  @Test
  void deleteItemById() {
    doNothing().when(checklistItemRepo).deleteItemById(1);

    service.deleteItemById(1);

    verify(checklistItemRepo, times(1)).deleteItemById(1);
  }

  @Test
  void editItemByIdTest() {
    ChecklistItemDTO input = new ChecklistItemDTO();
    input.setTitle("");
    input.setNote("");
    ChecklistItem checklistItem = new ChecklistItem();
    checklistItem.setItemId(1);
    checklistItem.setTitle("");
    checklistItem.setNote("");
    checklistItem.setDeleted(false);
    Optional<ChecklistItem> checklistItemOptional = Optional.of(checklistItem);
    doReturn(checklistItemOptional).when(checklistItemRepo).findById(1);
    doReturn(checklistItem).when(checklistItemRepo).save(any());

    ChecklistItemDTO returned = service.editItemById(input, 1);

    Assertions.assertEquals(returned.getItemId(), checklistItem.getItemId());
  }

  @Test
  void addItemTest() {
    ChecklistItemDTO input = new ChecklistItemDTO();
    input.setTitle("");
    input.setNote("");
    ChecklistItem item = new ChecklistItem();
    item.setItemId(1);
    when(checklistItemRepo.save(any())).thenReturn(item);

    ChecklistItemDTO returned = service.addItem(input);

    Assertions.assertEquals(returned.getItemId(), 1);
  }
}
