require('dotenv').config();
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

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

const username = encodeURIComponent(user);
const password = encodeURIComponent(pass);

// server.use(cors())

app.use(cors());
app.use(express.json());

const DataSchema = new mongoose.Schema({
    id: Number,
    username: String,
    firstname: String,
    lastname: String,
    age: Number
});

const CommentSchema = new mongoose.Schema({
    id: Number,
    username: String,
    comment: String
});

const Data = mongoose.model('Data', DataSchema);
const Comment = mongoose.model('Comment', CommentSchema);

async function getDatabase() {
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    // console.log(uri);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

app.post('/api/postComment', async (req, res) => {
    try {
        const database = await getDatabase();
        const commentsCollection = database.collection('comments');
        const body = req.body;
        if (body) {
            console.log(body);
            const inputComment = {
                id: await commentsCollection.countDocuments() + 1,
                username: '',
                comment: body.comment
            };
            const result = await commentsCollection.insertOne(inputComment);
            io.emit('Comment', inputComment);
            res.status(200).send(inputComment);
            console.log(`Data inserted with ID ${result.insertedId}`);
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
            console.log(body);
            const inputData = {
                id: await db.countDocuments() + 1,
                username: body.userName,
                firstname: body.firstName,
                lastname: body.lastName,
                age: body.age
            };
            const result = await db.insertOne(inputData);
            res.status(200).send(`Data inserted with ID ${result.insertedId}`);
            console.log(`Data inserted with ID ${result.insertedId}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR LOADING DATA");
    }
});

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

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
