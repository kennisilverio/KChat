const express = require('express')
const app = express()
const http = require('http').Server(app);
const bodyParser = require("body-parser")
const AWS = require('aws-sdk');
const config = require('./config');
const io = require('socket.io')(http);
const port = process.env.PORT || 4001;

AWS.config.update(config.aws_config)
const docClient = new AWS.DynamoDB.DocumentClient();
//static files

app.use(express.static('public'))
app.use(bodyParser.json())

//routes
  // Gets messages all messages
app.get('/api/chat', (req, res) => {
    const params = {
        TableName: config.aws_table_name,
    };
    docClient.scan(params, function(err, data) {
        if (err) {
        } else {
            var results = []
            data.Items.forEach((item) => {
                item.messages.forEach(m => {
                    results.push(m)
                })
            })
            res.send({
                success: true,
                alert: 'Loaded all messages',
                data: results
            });
        }
    });
});



  // Gets messages by handle
// app.get('/api/chat', (req, res) => {
//     const handle = req.query.handle;
//     const params = {
//       TableName: config.aws_table_name,
//       Key: {
//           handle: handle,
//       }
//     };
//     docClient.get(params, function(err, data) {
//       if (err) {
//         console.log(err, "error in doc.get")
//       } else {
//         const { Item } = data;
//         res.send({
//           success: true,
//           alert: 'Loaded messages for handle',
//           data: Item
//         });
//       }
//     });
//   });

app.post('/api/chat', (req, res) => {
    const handle = req.body.handle
    const message = req.body.message
    var params = {
      TableName: config.aws_table_name,
      Key: {
          handle: handle,
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #attrName = list_append(#attrName, :attrValue)',
      ExpressionAttributeNames: {
        '#attrName': 'messages'
      },
      ExpressionAttributeValues: {
        ':attrValue': [
            {
                "handle": handle,
                "date": Date().toString(),
                "message": message
            },                     
        ],
      },
    };
    docClient.update(params, function(err, data2){
        if(err){
            // console.log(err, "err in doc.update")
            var newParams = {
                TableName: config.aws_table_name,
                Item: {
                    "handle": handle,
                    "messages": [
                        {
                            "handle": handle,
                            "date": Date().toString(),
                            "message": message
                        },
                        ]
                } 
            };
            docClient.put(newParams, function(err, data1){
                if (err){
                    console.log(err, "err in doc.put")
                } else{
                    res.send({
                        success: true,
                        alert: 'Created and added messages for handle',
                        })
                }
            })
        } else {
            res.send({
            success: true,
            alert: 'updated messages for handle',
            data: data2
            });
        }
    })
})


//socket.io

io.on('connection', (client) => {
    // here you can start emitting events to the client 
    console.log("Client connected.")
    client.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
    io.on("disconnect", () => console.log("Client disconnected."));

  });

http.listen(port, function(){
    console.log(`listening on ${port}`);
  });

