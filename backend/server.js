require('dotenv').config();
const { MongoClient, Timestamp } = require("mongodb");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const axios = require('axios');


const app = express();
const server = require('http').createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust the origin as needed
        methods: ["GET", "POST"]
    }
});
const port = 3000;

const user = process.env.MONGO_USERNAME;
const pass = process.env.MONGO_PASSWORD;
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const username = encodeURIComponent(user);
const password = encodeURIComponent(pass);


const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=${GOOGLE_API_KEY}`;
// server.use(cors())

app.use(cors());
app.use(express.json());


const connectedUsers = {};

const DataSchema = new mongoose.Schema({
    id: Number,
    username: String,
    firstname: String,
    lastname: String,
    age: Number
});

const MessageSchema = new mongoose.Schema({
    location: {lat: Number, lng: Number},
    username: String,
    text: String,
    timestamp: {type: Date, default:Date.now},
})

const Data = mongoose.model('Data', DataSchema);
const Message = mongoose.model('Message', MessageSchema);

async function getDatabase() {
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    const client = new MongoClient(uri);
    let conn;
    try {
        conn = await client.connect();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const database = client.db('capstone');
        return database;
    } catch (e) {
        console.error(e);
    }
}

app.get('/api/getPosts', async (req, res) => {
    try {
        const database = await getDatabase();
        const commentsCollection = database.collection('comments');
        const comments = await commentsCollection.find().toArray();
        res.send(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving comments');
    }
});


app.get('/api/getLocationAddress/lng=:lng_/lat=:lat_', async (req,res)=>{

    try{
        const location = req.params;
        console.log(location);
        const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat_},${location.lng_}&key=${GOOGLE_API_KEY}`;
        console.log(GOOGLE_URL);
        const result = await axios.get(GOOGLE_URL);
        res.status(200).send({address: result.data.results[0].formatted_address});
    }
    catch(error){
        console.error(error);
        res.status(500).send("ERROR")
    }

})

app.get('/api/getUser/:id', async(req,res) =>{
    try{
        const sID = req.params.id;
        const database = await getDatabase();
        const usernames = database.collection('locally-usernames');
        const result = await usernames.findOne({socketId: sID })
        res.send(result);
    }catch(error){
        console.error(error);
    }
})

app.post('/api/postComment', async (req, res) => {
    try {
        const database = await getDatabase();
        const commentsCollection = database.collection('comments');
        const {username, text, location} = req.body;
        console.log(username, text);  //SA(77.10.24) Corrected log statement
        const newMessage = new Message({username, location, text, timestamp: new Date()})
        console.log(newMessage);  // SA(77.10.24)This will now log the message correctly
        // const result = await commentsCollection.insertOne(newMessage);
        io.emit('Comment', newMessage);
        res.status(200).send(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting comment');
    }
});


app.post('/api/postData', async (req, res) => {
    try {
        const database = await getDatabase();
        const db = database.collection('locally-usernames');
        const body = req.body;
        if (body) {
            const userCheck = await db.findOne({username: body.userName});
            console.log(`USER CHECK: ${userCheck}`)
            if(userCheck){
                console.log("USER IS THERE ALREADY")
                res.status(404).send("User is taken");
            }
            else{
                const inputData = {
                    id: await db.countDocuments() + 1,
                    username: body.userName,
                    firstname: body.firstName,
                    lastname: body.lastName,
                    socketId : body.socketID,
                    age: parseInt(body.age)
                };
            const result = await db.insertOne(inputData);
            res.status(200).send(`Data inserted with ID ${result.insertedId}`);
            console.log(`Data inserted with ID ${result.insertedId}`);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR LOADING DATA");
    }
});

//START CHECK EXISTENCE OF USER ID ALREADY CREATED - 7.7.24
app.get('/api/checkUserExists/:username', async (req, res) => {
    try {
        const database = await getDatabase();
        const checkUsername = req.params.username;
        const query = { username: checkUsername };
        const result = await database.collection('locally-usernames').findOne(query);
        if (!result) {
            console.log("NOT THERE");
            res.status(404).send('User not found');
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error checking user');
    }
});
//END CHECK EXISTENCE OF USER ID ALREADY CREATED - 7.7.24

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    connectedUsers [socket.id] = socket;
    if(Object.keys(connectedUsers).length > 100){
        console.log("Too many users... Disconnecting all users.");
    }

    socket.on('disconnect', () => {
        console.log('Disconnecting...', socket.id);
        delete connectedUsers[socket.id]
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// Function to disconnect all users
function disconnectAllUsers() {
    Object.keys(connectedUsers).forEach(socketId => {
        connectedUsers[socketId].disconnect(true);
        delete connectedUsers[socketId];
    });
    console.log('All users disconnected');
}


