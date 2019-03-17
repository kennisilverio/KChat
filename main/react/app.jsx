import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Output from './output.jsx';
import socketIOClient from "socket.io-client";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      handle: "",
      message: "",
      body: [],
      endpoint: "http://127.0.0.1:4001"
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.renderBody = this.renderBody.bind(this);

    //establish socket connection to socket io client
    this.socket = socketIOClient(this.state.endpoint)

    // on reception of the message from the server, adds message to dom
    this.socket.on('RECEIVE_MESSAGE', function(data){
      addMessage(data);
  });
  
  //adds message by setting the state of the body.
  const addMessage = data => {
      this.setState({body: [...this.state.body, data]});
  };
  }

  componentDidMount(){
    this.renderBody();

  }

  handleClick(e){
    e.preventDefault()
    axios.post('/api/chat', {
      message: this.state.message,
      handle: this.state.handle
    })
    .then(data => {
    this.socket.emit('SEND_MESSAGE', {
        handle: this.state.handle,
        message: this.state.message,
        date: new Date().toString()
    });      
    this.setState({
        message: ""
      })
    })
    .catch(err => console.log(err, "err in handleClick"))

  }

  renderBody(){
    axios.get('/api/chat')
    .then(({data}) => {
        this.setState({
            body: data.data
        })
    })
    .catch(err => console.log(err, "err in renderBody"))
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
              <Output body={this.state.body} renderBody={this.renderBody}/>
            </div>
        </div>
        <input id="handle" type="text" placeholder="Name" value={this.state.handle} onChange={this.handleChange}/>
        <input id="message" type="text" placeholder="Message" value={this.state.message} onChange={this.messageChange}/>
        <button onClick={this.handleClick} id="send">Send</button>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('App'));