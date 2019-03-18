import React from 'react';

const Bubbles = ({bubble}) => {
  const style = {
    border: 'solid',
    borderRadius: '2px',
    padding: '10px',
  }
  return (

  <div style={style}>
      
    <div> Name:  {bubble.handle}</div>    
    <div> Message: {bubble.message}</div>

</div>
)}

export default Bubbles;