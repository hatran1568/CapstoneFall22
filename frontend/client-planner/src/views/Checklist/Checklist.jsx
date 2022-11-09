import React, { Component } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import Tabs from "../GeneralInfo/TripDetailTabs";
import LoadingScreen from "react-loading-screen";
import style from "./Checklist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditItemModal from "./EditModal";
import {
  faXmark,
  faPen,
  faEllipsisVertical,
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
      edit: {
        show: false,
        item: {},
      },
    };
  }
  //get request to get trip info
  componentDidMount() {
    const { id } = this.props.params;
    axios
      .get(`http://localhost:8080/api/checklist/get-by-trip?tripId=` + id)
      .then((res) => {
        this.setState({
          checklistItems: res.data,
          dataLoaded: true,
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
      .post("http://localhost:8080/api/checklist/toggle-checked", {
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
      .delete(`http://localhost:8080/api/checklist/delete-item`, {
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
    axios({
      method: "put",
      url: "http://localhost:8080/api/checklist/put-item?id=" + item.itemId,
      headers: {
        "Content-Type": "application/json",
      },
      data: item,
    })
      .then((response) => {
        var curItem = this.state.checklistItems.find((el) => el.itemId == id);
        var index = -1;
        if (curItem) index = this.state.checklistItems.indexOf(curItem);
        var newList = this.state.checklistItems;
        newList[index] = item;
        this.setState({ checklistItems: newList });
        this.closeEditModal();
      })
      .catch(function (error) {
        console.log(error);
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
      edit: {
        item: {},
        show: false,
      },
    });
  };
  openEditModal = (event, item) => {
    this.setState({
      edit: {
        item: item,
        show: true,
      },
    });
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
          show={this.state.edit.show}
          item={this.state.edit.item}
          onHide={this.closeEditModal}
          onSubmit={(item) => {
            this.editItem(item);
          }}
        />
        <div className="container">
          <div className={style.checklistContainer}>
            {this.state.checklistItems.map((item) => (
              <div className="card" key={item.itemId}>
                <div className={`card-body ${style.cardBody}`}>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className={` ${style.itemCheckbox}`}
                    onChange={(event) =>
                      this.updateCheckedInState(event, item.itemId)
                    }
                  />
                  <label className={style.itemContent}>
                    <div className={style.content}>{item.content}</div>
                  </label>
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
          </div>
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
