import React from 'react'
import {useState} from 'react';
import style from "./ModalGraph.module.css";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-react-ui-kit";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function ModalGraph({props}) {
  //Graph data
  // const categoryDataB = categoryData;
  // const expenseDataB = expenseData;
  const labels = props.categoryData;
  const expenseData = props.expenseData;
  // categoryDataB.forEach((entry, index) => {
  //   categoryDataP.push(entry.name);
  // });
  // expenseDataB.forEach((entry, index) => {
  //   expenseDataP.push(entry.name);
  // });
  // console.log(labels);
  // console.log(expenseData);

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: '',
      },
      title: {
        display: true,
        text: 'Chi tiêu',
      },
    },
  };
  const expenseDataProcessed = {
    labels,
    datasets: [
      {
        label: 'Chi tiêu',
        data: expenseData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  //Breakdown Modal
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
  };
  return (
    <span>
      <a className={style.breakdownBtn} onClick={toggleShow}><FontAwesomeIcon icon={faChartSimple}/><b> Xem phân tích</b></a>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Phân tích chi phí</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Bar options={options} data={expenseDataProcessed} />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Đóng
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  )
}
export default ModalGraph