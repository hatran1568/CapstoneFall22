import React, { Component } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import Tabs from "../GeneralInfo/TripDetailTabs";
import LoadingScreen from "react-loading-screen";
import style from "./Checklist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditItemModal from "./EditModal";
import AddItemModal from "./AddModal";
import ContentEditable from "react-contenteditable";
import TripNotFound from "../../components/Trips/TripNotFound";
import CloneTripModal from "../../components/Trips/CloneTripModal";
import {
  faXmark,
  faPen,
  faEllipsisVertical,
  faPlus,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDeleteModal from "./ConfirmDelete";
class Checklist extends Component {
  state = {};
  //set state of component
  constructor(props) {
    super(props);
    this.state = {
      checklistItems: [],
      dataLoaded: false,
      delete: {
        itemId: "",
        show: false,
      },
      showEditModal: false,
      itemInEdit: {},
      showAddModal: false,
      showAddCard: false,
      showWarningTitle: false,
      addingTitle: "",
      addingNote: "",
      own: false,
      showCloneModal: false,
    };
    this.addNewTitleRef = React.createRef();
    this.addNewNoteRef = React.createRef();
    this.addNewCheckRef = React.createRef();
  }
  //get request to get trip info
  componentDidMount() {
    const { id } = this.props.params;
    const userId = localStorage.getItem("id") ? localStorage.getItem("id") : -1;
    axios
      .get(`/api/checklist/get-by-trip?tripId=` + id + "&userId=" + userId)
      .then((res) => {
        var own = false;
        console.log("true", userId);
        if (res.data.trip.userID && res.data.trip.userID == userId) {
          console.log("true");
          own = true;
        }
        this.setState({
          checklistItems: res.data.checklistItems,
          dataLoaded: true,
          tripId: id,
          trip: res.data.trip,
          own: own,
        });
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if (error.response.status == 404) {
            this.setState({
              dataLoaded: true,
              trip: null,
            });
          }
        }
      });
  }
  updateCheckedInState = (event, id) => {
    var curItem = this.state.checklistItems.find((el) => el.itemId == id);
    var index = -1;
    if (curItem) index = this.state.checklistItems.indexOf(curItem);
    var newList = this.state.checklistItems;
    curItem.checked = !curItem.checked;
    axios
      .post("/api/checklist/toggle-checked", {
        itemId: id,
        checked: curItem.checked,
      })
      .then(() => {
        newList[index] = curItem;
        this.setState({ checklistItems: newList });
      });
  };
  deleteItem = (event, id) => {
    axios
      .delete(`/api/checklist/delete-item`, {
        data: { itemId: id },
      })
      .then((response) => {
        if (response.status == 200) {
          var newList = this.state.checklistItems;
          newList = newList.filter((item) => {
            return item.itemId !== id;
          });
          this.setState({ checklistItems: newList }, this.closeConfirmDelete());
        }
      });
  };
  editItem = (item) => {
    console.log("editing");
    axios({
      method: "put",
      url: "/api/checklist/put-item?id=" + item.itemId,
      headers: {
        "Content-Type": "application/json",
      },
      data: item,
    })
      .then((response) => {
        var curItem = this.state.checklistItems.find(
          (el) => el.itemId == item.itemId
        );
        var index = -1;
        if (curItem) index = this.state.checklistItems.indexOf(curItem);
        var newList = this.state.checklistItems;
        newList[index] = response.data;
        this.setState({ checklistItems: newList });
        this.closeEditModal();
        this.setState({ itemInEdit: {} });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  insertItem = (event, item) => {
    item.tripId = this.state.tripId;
    axios.post(`/api/checklist/add-item`, item).then((response) => {
      var newList = this.state.checklistItems;
      newList.push(response.data);
      this.setState({ checklistItems: newList, showAddModal: false });
    });
  };
  closeConfirmDelete = () => {
    this.setState({
      delete: {
        itemId: "",
        show: false,
      },
    });
  };
  openConfirmDelete = (event, id) => {
    this.setState({
      delete: {
        itemId: id,
        show: true,
      },
    });
  };
  closeEditModal = () => {
    this.setState({
      itemInEdit: {},
      showEditModal: false,
    });
  };
  openEditModal = (event, item) => {
    this.setState({ itemInEdit: item }, () => {
      this.setState({ showEditModal: true });
    });
  };
  //toggle add modal
  toggleAddModal = () => {
    var show = this.state.showAddModal;
    this.setState({ showAddModal: !show });
  };
  //toggle add card
  toggleAddCard = () => {
    var show = this.state.showAddCard;
    if (show) {
      this.addNewCheckRef.current.checked = false;
      this.setState({ addingNote: "", addingTitle: "", showAddCard: !show });
    } else this.setState({ showAddCard: !show });
  };
  openAddCard = () => {
    var show = this.state.showAddCard;
    if (show) return;
    else this.setState({ showAddCard: !show });
  };
  pasteAsPlainText = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };
  disableNewlines = (event) => {
    const keyCode = event.keyCode || event.which;

    if (keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) event.preventDefault();
    }
  };
  addItemFromCard = () => {
    var newName = this.addNewTitleRef.current.textContent.substring(0, 100);
    var newNote = this.addNewNoteRef.current.textContent.substring(0, 200);
    if (newName.trim().length == 0) {
      this.setState({ showWarningTitle: true });
    } else {
      axios
        .post(`/api/checklist/add-item`, {
          tripId: this.state.tripId,
          checked: this.addNewCheckRef.current.checked,
          title: newName,
          note: newNote,
        })
        .then((response) => {
          var newList = this.state.checklistItems;
          newList.push(response.data);
          this.addNewCheckRef.current.checked = false;
          this.setState({
            checklistItems: newList,
            addingNote: "",
            addingTitle: "",
            showAddCard: false,
          });
        });
    }
  };
  handleTitleOnBlur = () => {
    var newName = this.addNewTitleRef.current.textContent.substring(0, 100);
    this.setState({ addingTitle: newName });
  };
  handleNoteOnBlur = () => {
    var newNote = this.addNewNoteRef.current.textContent.substring(0, 200);
    this.setState({ addingNote: newNote });
  };
  closeCloneModal = () => {
    this.setState({ showCloneModal: false });
  };
  openCloneModal = () => {
    this.setState({ showCloneModal: true });
  };
  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingScreen
          loading={true}
          bgColor="#f1f1f1"
          spinnerColor="#9ee5f8"
          textColor="#676767"
          text="Please wait a bit while we get your plan..."
        >
          <div></div>
        </LoadingScreen>
      );
    if (this.state.dataLoaded && this.state.trip == null) {
      return <TripNotFound />;
    }
    var totalItems = this.state.checklistItems.length;
    var checkedItems = this.state.checklistItems.filter((item) => {
      return item.checked == true;
    }).length;
    return (
      <div>
        <TripGeneralInfo />
        <Tabs />
        {!this.state.own ? (
          <div className={style.notOwned}>
            <CloneTripModal
              show={this.state.showCloneModal}
              onHide={this.closeCloneModal}
              tripId={this.state.trip.tripId}
              tripStartDate={this.state.trip.startDate}
              tripEndDate={this.state.trip.endDate}
            />
            Không thể xem danh sách của người khác. <br /> Bạn có thể sao chép
            kế hoạch này, hoặc tạo một chuyến đi mới cho mình.
            <div className={style.btnGroup}>
              <a
                className={`${style.createBtn} ${style.cloneBtn}`}
                onClick={this.openCloneModal}
              >
                Sao chép chuyến đi này
              </a>
              <a className={style.createBtn} href="../">
                Tạo chuyến đi mới
              </a>
            </div>
          </div>
        ) : (
          <div>
            <ConfirmDeleteModal
              show={this.state.delete.show}
              message="Bạn có chắc chắn muốn xóa mục này?"
              itemId={this.state.delete.itemId}
              onHide={this.closeConfirmDelete}
              onConfirmed={(event, id) => {
                this.deleteItem(event, id);
              }}
            />
            <EditItemModal
              show={this.state.showEditModal}
              item={this.state.itemInEdit}
              key={this.state.itemInEdit.itemId}
              onHide={this.closeEditModal}
              onSubmit={(event, item) => {
                this.editItem(item);
              }}
            />
            <AddItemModal
              show={this.state.showAddModal}
              onHide={this.toggleAddModal}
              itemAdded={(event, input) => this.insertItem(event, input)}
            />
            <div className="container" style={{ paddingTop: 0 }}>
              <div className={style.checklistContainer}>
                {this.state.checklistItems.length > 0 ? (
                  <div>
                    <div className={style.progressDiv}>
                      <div className={style.rateDiv}>
                        {checkedItems} {"/"} {totalItems} đã hoàn thành
                        <a onClick={this.toggleAddModal}>
                          <FontAwesomeIcon
                            icon={faPlus}
                            className={style.addIcon}
                          />
                          Thêm
                        </a>
                      </div>
                      <div>
                        <progress
                          id="file"
                          value={checkedItems}
                          max={totalItems}
                          className={style.progressBar}
                          height={25}
                          color={"#e6a825"}
                        ></progress>
                      </div>
                    </div>
                    {this.state.checklistItems.map((item) => (
                      <div className={`card ${style.card}`} key={item.itemId}>
                        <div className={`card-body ${style.cardBody}`}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            className={` ${style.itemCheckbox}`}
                            onChange={(event) =>
                              this.updateCheckedInState(event, item.itemId)
                            }
                          />
                          <label className={style.itemContent}>
                            <div className={style.itemTitle}>{item.title}</div>
                          </label>
                          {item.note && item.note != "" ? (
                            <div className={style.noteDiv}>
                              <span>Ghi chú:</span>
                              <div>{item.note}</div>
                            </div>
                          ) : null}

                          <div className={style.dropdown}>
                            <button type="button" className={style.deleteBtn}>
                              <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                size="lg"
                              />
                            </button>
                            <div className={style.dropdownMenu}>
                              <a
                                className="dropdown-item"
                                onClick={(event) => {
                                  this.openConfirmDelete(event, item.itemId);
                                }}
                              >
                                Xóa
                              </a>
                              <a
                                className="dropdown-item"
                                onClick={(event) => {
                                  this.openEditModal(event, item);
                                }}
                              >
                                Chỉnh sửa
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: "large" }}>Bạn chưa có mục nào.</div>
                )}
                <div
                  className={
                    this.state.showAddCard
                      ? `card ${style.card}`
                      : `card ${style.hide}`
                  }
                >
                  <div className={`card-body ${style.cardBody}`}>
                    <input
                      type="checkbox"
                      className={` ${style.itemCheckbox}`}
                      ref={this.addNewCheckRef}
                      autoFocus
                    />
                    <ContentEditable
                      html={this.state.addingTitle}
                      className={` ${style.addTitle}`}
                      spellCheck={false}
                      placeholder="Thêm tiêu đề"
                      innerRef={this.addNewTitleRef}
                      onPaste={this.pasteAsPlainText}
                      onKeyPress={this.disableNewlines}
                      onBlur={this.handleTitleOnBlur}
                    />
                    <div
                      className={
                        this.state.showWarningTitle
                          ? `${style.warningMessage}`
                          : `${style.warningMessage} ${style.hide}`
                      }
                    >
                      Tiêu đề không được trống
                    </div>
                    <div className={style.noteDiv}>
                      <span>Ghi chú:</span>
                      <div>
                        <ContentEditable
                          html={this.state.addingNote}
                          className={` ${style.addNote}`}
                          spellCheck={false}
                          placeholder="Thêm ghi chú của bạn ở đây..."
                          innerRef={this.addNewNoteRef}
                          onPaste={this.pasteAsPlainText}
                          onKeyPress={this.disableNewlines}
                          onBlur={this.handleNoteOnBlur}
                        />
                      </div>
                    </div>
                    <div>
                      <a
                        className={` ${style.cardAddBtn}`}
                        onClick={this.addItemFromCard}
                      >
                        Thêm
                      </a>
                    </div>
                    <div className={style.dropdown}>
                      <button
                        type="button"
                        className={style.deleteBtn}
                        onClick={this.toggleAddCard}
                      >
                        <FontAwesomeIcon icon={faMinus} size="lg" />
                      </button>
                    </div>
                  </div>
                </div>
                <a className={` ${style.btnAdd}`} onClick={this.openAddCard}>
                  <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
                  Thêm mục
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => {
    return <Component {...props} params={useParams()} />;
  };
}
export default withParams(Checklist);
