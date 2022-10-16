import { useState,useEffect } from "react";
import axios from "../../api/axios";
import { MDBInput ,MDBListGroup,MDBListGroupItem} from 'mdb-react-ui-kit';
import style from './ResultList.module.css'
import './override.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLocationDot,faMapLocationDot,faBlog,faSearch} from '@fortawesome/free-solid-svg-icons'
function ResultList(props){
    const [result,setResult] = useState(false);
    const [select,setSelect] = useState(0);
    const getResult = ()=>{
        
        axios.get("http://localhost:8080/search/both/"+props.text,{
            headers: { "Content-Type": "application/json"}
        }).then((response) => response.data).catch(()=> setResult(false)).then((data)=>setResult(data))
    }
    useEffect(getResult,[props.text])
    return <MDBListGroup  >
        
        {result && result.map((item,index)=><MDBListGroupItem onMouseOver={()=>setSelect(index)} onMouseLeave={()=>setSelect(0)} active={select==index} className={style.item +" px-3 square border"} color='light'  key ={index}> <div className={style.icon}><FontAwesomeIcon icon={item.type=="DESTINATION"?faLocationDot:item.type=="POI"?faMapLocationDot:faBlog} /></div>	&nbsp;	&nbsp;	{item.name}</MDBListGroupItem>)}
           {
            props.text && <MDBListGroupItem className={style.item +" px-3 square border"} >
                <FontAwesomeIcon className={style.icon} icon={faSearch}></FontAwesomeIcon>	&nbsp;	&nbsp;	
            See more result for "{props.text}"
           </MDBListGroupItem>
           }
           
    </MDBListGroup>
}
export default ResultList