import React, { Component } from "react";
import style from "./TripNotFound.module.css";
class TripNotFound extends Component {
  state = {};
  render() {
    return (
      <div className={style.mainDiv}>
        <img src="../img/default/vacation.jpeg" alt="" />
        <div className={style.notiBox}>
          <div className={style.notiHeader}>Không tìm thấy chuyến đi này</div>
          <div className={style.notiBody}>
            <div>
              Chúng tôi hiện tại không thể tìm thấy chuyến đi này. Có thể chuyến
              đi đã bị xóa hoặc bạn không có quyền truy cập đến nó.
              <br />
              <i>Mẹo:</i> Tạo một tài khoản để lưu tất cả các chuyến đi của bạn
              và lưu chúng trên nhiều thiết bị.
            </div>
            <div className={style.centerBtnGroup}>
              <a className={style.createBtn} href="../">
                Tạo chuyến đi mới
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TripNotFound;
