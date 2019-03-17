import React from 'react';

const Bubbles = (props) => {
  const style = {
    border: 'solid',
    borderRadius: '2px',
    padding: '10px',
  }
  return (

  <div style={style}>
      
    <div> Name:  {props.bubble.handle}</div> 
    <div> Date: {props.bubble.date}</div>   
    <div> Message: {props.bubble.message}</div>

</div>
)}

export default Bubbles;