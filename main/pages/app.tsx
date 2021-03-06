import * as React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Output from './output';
import socketIOClient from "socket.io-client";



interface myState {
  handle: string,
  message: string,
  body: any[],
  endpoint: string
}

let socket;

class App extends React.Component<{}, myState> {
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
    socket = socketIOClient(this.state.endpoint);
    
    // on reception of the message from the server, adds message to dom
    socket.on('RECEIVE_MESSAGE', function(data: any){
      addMessage(data);
  });
  //adds message by setting the state of the body.
  const addMessage = (data: any) => {
      this.setState({body: [...this.state.body, data]});
  };
  }

  componentDidMount(){
    this.renderBody();

  }

  private handleClick(e){
    e.preventDefault()
    axios.post('/api/chat', {
      message: this.state.message,
      handle: this.state.handle
    })
    .then(data => {
    socket.emit('SEND_MESSAGE', {
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

  private renderBody(){
    axios.get('/api/chat')
    .then(({data}) => {
        this.setState({
            body: data.data
        })
    })
    .catch(err => console.log(err, "err in renderBody"))
}
  
  private handleChange(e){
    this.setState({
      handle: e.target.value
    })
  }

  private messageChange(e){
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