import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
  } from "mdb-react-ui-kit";
import style from './POIBoxLarge.module.css';
import React from "react";
import ReactDOM from "react-dom"
import Rating from './Rating.jsx';
class POIBoxLarge extends React.Component {
    render() {
        const data = this.props.data;
        const str = data.description;
        const poiLink = "../../poi?id=" + data.activityId;
        let substr = "";
        if (str != null)
            substr = str.substring(0,300) + "...";
        let imgstr = "";
        if (data.image != null)
            imgstr = "../" + data.image;
        else 
            imgstr = "https://picsum.photos/seed/picsum/200/300";
        return(
            <MDBCard className={style.poiLargeBox}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='2' className={style.poiThumbBox}>
                            <img className={style.poiThumb} src={imgstr}/><br/><br/>
                        </MDBCol>
                        <MDBCol className={style.poiInfoBox}>
                            <i>{data.categoryName}</i><br/>
                            <a href={poiLink} className={style.poiName}><b>{data.name}</b></a><br/>
                            <Rating ratings={data.googleRating}/><br/>
                            <span>{substr}</span><br/>
                            <b><span className={style.poiPrice}>Other travelers usually spends {data.typicalPrice}VND here</span></b>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        )
    }
}
export default POIBoxLarge;