require('dotenv').config();
const { MongoClient } = require("mongodb");
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

app.use(cors());
app.use(express.json());

const CommentSchema = new mongoose.Schema({
    userName: String,
    address: String,
    comments: [{
        userName: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    timestamp: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
    location: {lat: Number, lng: Number},
    address: String,
    username: String,
    text: String,
    timestamp: {type: Date, default:Date.now},
})

const FirstMessageSchema = new mongoose.Schema({
    userName: String,
    address: String,
    title: String,
    comments: {type: [String], default:[]},
    timestamp: {type: Date, default:Date.now},
})


const Data = mongoose.model('Data', DataSchema);
const Message = mongoose.model('Message', MessageSchema);
const FirstMessage = mongoose.model('FirstMessage', FirstMessageSchema);

async function getDatabase() {
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
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

app.get('/api/getLocationAddress/lng=:lng_/lat=:lat_', async (req, res) => {
    try {
        const location = req.params;
        const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat_},${location.lng_}&key=${GOOGLE_API_KEY}`;
        const result = await axios.get(GOOGLE_URL);
        res.status(200).send({ address: result.data.results[0].formatted_address });
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR");
    }
});

app.get('/api/getUser/:id', async (req, res) => {
    try {
        const sID = req.params.id;
        const database = await getDatabase();
        const usernames = database.collection('locally-usernames');
        const result = await usernames.findOne({ socketId: sID });
        res.send(result);
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/checkComment/address=:address', async(req,res) =>{

    try{
        const location = req.params;
        const database = await getDatabase();
        const commentCluster = database.collection('comments');
        const result = await commentCluster.findOne({address: location.address})
        console.log(location.lat_ + location.lng_);
        if(!result) return res.send({address: null});
        res.status(200).send(result);
    }catch(error){
        console.error(error);
        res.status(404).send("ERROR");
    }

})

app.post('/api/postComment', async (req, res) => {
    try {
        const database = await getDatabase();
        const commentsCollection = database.collection('comments');
        const { userName, text, address } = req.body;

        const newComment = {
            userName: userName,
            text: text,
            timestamp: new Date()
        };

        let existingDoc = await commentsCollection.findOne({ address: address });

        if (existingDoc) {
            const result = await commentsCollection.updateOne(
                { address: address },
                { $push: { comments: newComment } }
            );
            existingDoc.comments.push(newComment); // Update the in-memory document
            io.emit('Comment', newComment); // Emit the new comment
            res.status(200).send(newComment);
        } else {
            const newDoc = {
                userName: userName,
                address: address,
                comments: [newComment],
                timestamp: new Date()
            };
            const result = await commentsCollection.insertOne(newDoc);
            io.emit('Comment', newDoc); // Emit the new document
            res.status(200).send(newDoc);
        }
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
            const userCheck = await db.findOne({ username: body.userName });
            if (userCheck) {
                res.status(404).send("User is taken");
            } else {
                const inputData = {
                    id: await db.countDocuments() + 1,
                    username: body.userName,
                    firstname: body.firstName,
                    lastname: body.lastName,
                    socketId: body.socketID,
                    age: parseInt(body.age)
                };
                const result = await db.insertOne(inputData);
                res.status(200).send(`Data inserted with ID ${result.insertedId}`);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR LOADING DATA");
    }
});

app.post('/api/postFirstComment', async(req,res)=>{
    try {
        const database = await getDatabase();
        const commentsCollection = database.collection('comments');
        const {userName, comments, address, title} = req.body;
        console.log(userName, title, address);  //SA(77.10.24) Corrected log statement
        const newMessage = new FirstMessage({userName, address, title, comments, timestamp: new Date()})
        console.log(newMessage);  // SA(77.10.24)This will now log the message correctly
        const result = await commentsCollection.insertOne(newMessage);
        io.emit('Comment', newMessage);
        res.status(200).send(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting comment');
    }

})

//START CHECK EXISTENCE OF USER ID ALREADY CREATED - 7.7.24
app.get('/api/checkUserExists/:username', async (req, res) => {
    try {
        const database = await getDatabase();
        const checkUsername = req.params.username;
        const query = { username: checkUsername };
        const result = await database.collection('locally-usernames').findOne(query);
        if (!result) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(result);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error checking user');
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Disconnecting...', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
