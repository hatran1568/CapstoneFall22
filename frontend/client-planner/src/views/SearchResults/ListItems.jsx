import { MDBListGroupItem, MDBListGroup } from "mdb-react-ui-kit";
import React from "react";
import CardItem from "./CardItem";
import style from "./ListItems.module.css";
function ListItems(props) {
  return (
    <MDBListGroup>
      {props.list.map((item) => (
        <MDBListGroupItem className={style.item}>
          <CardItem item={item} className={style.item}></CardItem>
        </MDBListGroupItem>
      ))}
    </MDBListGroup>
  );
}

export default ListItems;
