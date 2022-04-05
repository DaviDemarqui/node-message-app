var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http').Server(express);
var io = require('socket.io')(http);

var app = express();

io.on('connection', (socket) => {
    console.log('a user is connected');
});

const dbUrl = 'mongodb+srv://davi:0802@ddb-01.ngvxa.mongodb.net/DDB-01';

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
});

var Message = mongoose.model('Message', { name: String, message : String });

const server = app.listen(3000, () => {
    console.log('O servidor está rodando na porta ', server.address().port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/messages", express.static(__dirname + '/template'));

app.get('/message', (req, res) => {
    Message.find({}, (err, message)=> {
        res.send(message);
    });
}); 

app.post('/message', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);    
        res.sendStatus(200);    
    });
});