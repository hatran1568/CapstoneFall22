import React from 'react';
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardSubTitle,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import style from './CardItem.module.css'
function CardItem(props) {
   
    return <a href={props.item.type=="DESTINATION"?("Destination?id="+props.item.id):(props.item.type=="BLOG"?"#":("poi?id="+props.item.id))} className={style.link}><MDBCard  className={style.item}>
    <MDBRow className='g-0'>
      <MDBCol md='3'>
        <MDBCardImage className={style.image} src={props.item.thumbnail==null?"https://media-cdn.tripadvisor.com/media/photo-s/17/a6/44/8f/photo0jpg.jpg":props.item.thumbnail} alt='...' fluid />
      </MDBCol>
      <MDBCol md='9'>
        <MDBCardBody>
          <MDBCardTitle>{props.item.name}</MDBCardTitle>
          <MDBCardSubTitle className={style.type}>{props.item.type.split('_').join(" ").toLowerCase()}</MDBCardSubTitle>
          <MDBCardSubTitle>
            <small className='text-muted'>{props.item.numberOfRate==0?' ':props.item.numberOfRate+" reviews"}</small>
          </MDBCardSubTitle>
          <MDBCardSubTitle>
          &nbsp; &nbsp;
          </MDBCardSubTitle>
          <MDBCardText>
            {props.item.description && props.item.description.split(' ').length>30?props.item.description.split(' ').slice(0,30).join(' ')+" ...":props.item.description}  
          </MDBCardText>
        </MDBCardBody>
      </MDBCol>
    </MDBRow>
  </MDBCard>
  </a> 
  
}

export default CardItem


