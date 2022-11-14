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
import {
  faXmark,
  faPen,
  faEllipsisVertical,
  faPlus,
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
    };
  }
  //get request to get trip info
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`/api/checklist/get-by-trip?tripId=` + id).then((res) => {
      this.setState({
        checklistItems: res.data,
        dataLoaded: true,
        tripId: id,
      });
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
    var newShow = this.state.showAddModal;
    this.setState({ showAddModal: !newShow });
  };
  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingScreen
          loading={true}
          bgColor="#f1f1f1"
          spinnerColor="#9ee5f8"
          textColor="#676767"
          // logoSrc="/logo.png"
          text="Please wait a bit while we get your plan..."
        >
          <div></div>
        </LoadingScreen>
      );
    return (
      <div>
        <TripGeneralInfo />
        <Tabs />
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
        <div className="container">
          {this.state.checklistItems.length > 0 ? (
            <div className={style.checklistContainer}>
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
                        <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
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

              <a className={` ${style.btnAdd}`} onClick={this.toggleAddModal}>
                <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
                Thêm mục
              </a>
            </div>
          ) : (
            <div className={style.checklistContainer}>
              <div style={{ fontSize: "large" }}>Bạn chưa có mục nào.</div>
              <a className={` ${style.btnAdd}`} onClick={this.toggleAddModal}>
                <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
                Thêm mục
              </a>
            </div>
          )}
        </div>
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
