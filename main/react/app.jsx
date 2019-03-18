import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Output from './output.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      handle: "",
      message: "",
      body: [],
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  handleClick(){
    axios.post('/chat', {
      message: this.state.message,
      handle: this.state.handle
    })
    this.renderBody();
  }

  renderBody(){
    axios.get('/chats', {handle: this.state.handle})
    .then((data) => {
        this.setState({
            body: this.state.body.push(data)
        })
    })
}
  
  handleChange(e){
    this.setState({
      handle: e.target.value
    })
  }

  messageChange(e){
    this.setState({
      message: e.target.value
    })
  }

  render () {
    return (
    <div id="KChat">
        <div id="chat-window">
            <div id="output">
              <Output body={this.state.body}/>
            </div>
        </div>
        <input id="handle" type="text" placeholder="Name" value={this.state.handle} onChange={this.handleChange}/>
        <input id="message" type="text" placeholder="Message" value={this.state.message} onChange={this.messageChange}/>
        <button onClick={this.handleClick} id="send">Send</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('App'));