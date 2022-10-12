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
        const substr = str.substring(0,300) + "...";
        const imgstr = "../" + data.image;
        return(
            <MDBCard className={style.poiLargeBox}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='2' className={style.poiThumbBox}>
                            <img className={style.poiThumb} src={imgstr}/><br/><br/>
                            <MDBBtn color="secondary" className={style.exploreBtn}>See More about {data.name}</MDBBtn>
                        </MDBCol>
                        <MDBCol className={style.poiInfoBox}>
                            <i>{data.categoryName}</i><br/>
                            <b>{data.name}</b><br/>
                            <Rating ratings={data.rating}/><br/>
                            <span>{substr}</span><br/>
                            <span className={style.poiPrice}>Other travelers usually spends {data.price}VND here</span>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        )
    }
}
export default POIBoxLarge;