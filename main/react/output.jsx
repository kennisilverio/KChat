import React from 'react';
import Bubbles from './bubbles.jsx';

class Output extends React.Component { 
    constructor(props) {
        super(props)
    }
    
    render(){
        // this.props.body.sort(function(a, b) {
        //     a = new Date(a.date);
        //     b = new Date(b.date);
        //     return a>b ? -1 : a<b ? 1 : 0;
        // })
        return (
        <div>
            {this.props.body.slice(0).reverse().map((bubble, i)=> { 
                // better to use unique id as key but will use index for now           
                return <Bubbles bubble={bubble} key={i}/>
            })}
        </div>
      )
    }
}

  export default Output;