import { MDBListGroupItem, MDBListGroup } from "mdb-react-ui-kit";
import React from "react";
import CardItem from "./CardItem";
import style from "./ListItems.module.css";
function ListItems(props) {
  const vietCategories = {
    DESTINATION: "Điểm đến",
    BLOG: "Blog",
    ART_AND_CULTURE: "Văn hóa, nghệ thuật",
    OUTDOORS: "Hoạt động ngoài trời",
    RELIGION: "Tôn giáo",
    HISTORIC_SIGHTS: "Lịch sử",
    MUSEUMS: "Bảo tàng",
    SPAS_AND_WELLNESS: "Spa & Sức khỏe",
    SHOPPING: "Mua sắm",
    BEACHES: "Bãi biển",
    NIGHTLIFE: "Hoạt động đêm",
    HOTELS: "Khách sạn",
    RESTAURANTS: "Nhà hàng",
    ENTERTAINMENTS: "Giải trí",
  };
  return (
    <MDBListGroup>
      {props.list.map((item) => (
        <MDBListGroupItem className={style.item}>
          <CardItem
            item={item}
            className={style.item}
            type={vietCategories[item.type]}
          ></CardItem>
        </MDBListGroupItem>
      ))}
    </MDBListGroup>
  );
}

export default ListItems;
