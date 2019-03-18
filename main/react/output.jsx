import React from 'react';
import Bubbles from './bubbles.jsx';

const Output = (props) => {
    return (
    <div>
        {props.body.map((bubble, i)=> {
            return <Bubbles bubble={bubble} key={i}/>
        })}
    </div>
  )}
  
  export default Output;