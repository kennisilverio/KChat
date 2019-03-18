import React from 'react';

const Bubbles = (props) => {
  const style = {
    border: 'solid',
    borderRadius: '2px',
    padding: '10px',
  }
  return (

  <div style={style}>
      
    <div> Name:  <strong>{props.bubble.handle}</strong></div> 
    <div> Date: <strong>{props.bubble.date}</strong></div>   
    <div> Message: <strong>{props.bubble.message}</strong></div>

</div>
)}

export default Bubbles;