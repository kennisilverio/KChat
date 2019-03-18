const express = require('express')
const app = express()
const http = require('http').Server(app);
const bodyParser = require("body-parser")
const AWS = require('aws-sdk');
const config = require('./config');
const isDev = process.env.NODE_ENV !== 'production';

AWS.config.update(config.aws_config)
const docClient = new AWS.DynamoDB.DocumentClient();
//static files

app.use(express.static('public'))
app.use(bodyParser.json())

//routes
  // Gets messages by handle
app.get('/api/chat', (req, res) => {
    const handle = req.query.handle;
    const params = {
      TableName: config.aws_table_name,
      Key: {
          "handle": handle,
      }
    };
    docClient.get(params, function(err, data) {
      if (err) {
        console.log(err, "error in doc.get")
      } else {
        console.log('data', data);
        const { Item } = data;
        res.send({
          success: true,
          alert: 'Loaded messages for handle',
          data: Item
        });
      }
    });
  });

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
                "date": Date().toString(),
                "message": message
            },                     
        ],
      },
    };
    
    // docClient.get(params, function(err, data) {
    //   if (err) {
    //     var newParams = {
    //         TableName: config.aws_table_name,
    //         Item: {
    //             "handle": handle,
    //             "messages": [
    //                 {
    //                     "date": Date().toString(),
    //                     "message": message
    //                 },
    //              ]
    //         } 
    //     };
    //     console.log(newParams, "params")
    //     docClient.put(newParams, function(err, data1){
    //         if (err){
    //             console.log(err, "err in doc.put")
    //         } else{
    //             console.log('data', data1)
    //             res.send({
    //                 success: true,
    //                 alert: 'Created and added messages for handle',
    //               })
    //         }
    //     })
    //   } else {
            // params.ReturnValues = 'ALL_NEW'
            // params.UpdateExpression = 'set #attrName = list_append(#attrName, :attrValue)'
            // params.ExpressionAttributeNames = {
            //   '#attrName': 'messages'
            // }
            // params.ExpressionAttributeValues = {
            //     ':attrValue': [
            //         {
            //             "date": Date().toString(),
            //             "message": message
            //         },                     
            //     ],
            // }
            docClient.update(params, function(err, data2){
                if(err){
                    // console.log(err, "err in doc.update")
                    var newParams = {
                        TableName: config.aws_table_name,
                        Item: {
                            "handle": handle,
                            "messages": [
                                {
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
        // }
    })

// })

http.listen(3000, function(){
    console.log('listening on *:3000');
  });
