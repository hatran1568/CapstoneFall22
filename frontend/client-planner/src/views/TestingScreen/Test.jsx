import React from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
function Test() {


    var stompClient =null;
 const sendMessage = (msg) => {
    this.clientRef.sendMessage('/topics/all', msg);
  }
  const connect = (userId) => {
    if (userId) {
      var socket = new SockJS("http://localhost:8080/ws");
      stompClient = over(socket);
        console.log("connected");
      stompClient.connect({}, onConnected, onError);

    }
    }
    const onError = (err) => {
        console.log(err);
        
    }

    const onConnected = () => {
    console.log("onConnected");
    // Subscribe to the Public Topic
    stompClient.subscribe("/chatroom",onMessageReceived);
    stompClient.subscribe('/user/'+'abc'+'/chatroom', onPrivateMessage);
    
   
}

const onMessageReceived = (payload)=>{
    console.log(payload);
}
const onPrivateMessage = (payload)=>{
    console.log(payload);
}



    return (
      <div>
            <button onClick={connect}>Connect</button>
      </div>
    );
  
}

export default Test;