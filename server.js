var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http').Server(express);
var io = require('socket.io')(http);

var app = express();

var cors = require('cors');
app.use(cors({origin: 'https://zap2.vercel.app'}));


io.on('connection', (socket) => {
    console.log('a user is connected');
});

const dbUrl = 'mongodb+srv://zap:123@zap.ngvxa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
});

var Message = mongoose.model('Message', { name: String, message : String });

const server = app.listen(3000, () => {
    console.log('O servidor está rodando na porta ', server.address().port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static(__dirname + '/template'));

app.get('/', (req, res) => {
    Message.find({}, (err, messages)=> {
        res.send(messages);
    });
}); 

app.post('/', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);    
        res.sendStatus(200);    
    });
});

app.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send(console.log("cors fixed"));
});