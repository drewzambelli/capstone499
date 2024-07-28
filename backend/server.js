require('dotenv').config();
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const cron = require("node-cron")
const axios = require('axios');
const XLSX = require('xlsx'); //DZ testing
const ExcelJS = require('exceljs'); // DZ testing

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

app.use(cors());
app.use(express.json());

// DZ TESTING 7.27: Define boroughs and their Excel file paths
const boroughs = {
    "Bronx": "BACKEND/data/bronx.xlsx",
    "Brooklyn": "BACKEND/data/brooklyn.xlsx",
    "Manhattan": "BACKEND/data/manhattan.xlsx",
    "Queens": "BACKEND/data/queens.xlsx",
    "Staten Island": "BACKEND/data/staten_island.xlsx"
};

const CommentSchema = new mongoose.Schema({
    userName: String,
    address: {
        latLang: { lat: Number, lng: Number },
        formatted_address: String
    },
    comments: [{
        userName: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    timestamp: { type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', CommentSchema);

async function getDatabase() {
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await mongoose.connect(uri);
        const database = client.db('capstone');
        return database;
    } catch (e) {
        console.error(e);
    }
}

cron.schedule('0 * * * *', async() =>{
    try{
        const db = await getDatabase();
        const commentsCollection = db.collection('comments');
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        await commentsCollection.updateMany(
            {},
            { $pull: { comments: { timestamp: { $lt: yesterday } } } }
        );
        console.log("OLD COMMENTS REMOVED");
    }catch(error){
        console.log("error removing old comments", error);
    }
})



/**
 * @about: Getting all the comments from the mongodb database
 */

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


/**
 * @about: Returns a location based on the lat and lng given from the params
 */

app.get('/api/getLocationAddress/lng=:lng_/lat=:lat_', async (req, res) => {
    try {
        const location = req.params;
        const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat_},${location.lng_}&key=${GOOGLE_API_KEY}`;
        const result = await axios.get(GOOGLE_URL);

        // DZ TEST 7.27: Log borough names
        const boroughName = result.data.results[0].address_components.find(component => component.types.includes("political")).long_name;
        console.log("Borough Name:", boroughName);

        res.status(200).send(result.data.results[0] );
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR");
    }
});

/**
 * @about: returns the user given the socketID (not currently in use might remove)
 * 
 */

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

/**
 * 
 * @about: returns all the Latitude and Longitudes from the mongo db 
 */

app.get('/api/getAllLatLong', async (req, res) => {
    try {
        const database = await getDatabase();
        const comments = database.collection('comments');
        const results = await comments.find({}, { "address.latLang": 1, "_id": 0 }).toArray(); // Added query to get all LatLong
        res.status(200).send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send("ERROR RETRIEVING LAT LONG");
    }
});

/**
 * @about: post the comment given the username, the actual comment, and the address
 */

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

        // Check if a document with the same formatted address exists
        let existingDoc = await commentsCollection.findOne({ "address.formatted_address": address.formatted_address });

        if (existingDoc) { //check if the address is already in the db and just pushes the comment to the comments array
            const result = await commentsCollection.updateOne(
                { "address.formatted_address": address.formatted_address },
                { $push: { comments: newComment } }
            );
            existingDoc.comments.push(newComment); // Update the in-memory document
            io.emit('Comment', existingDoc); // Emit the updated document
            res.status(200).send(existingDoc);
        } else {
            const newDoc = {
                userName: userName,
                address: {
                    latLang: address.latLang,
                    formatted_address: address.formatted_address
                },
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

/**
 * @about: sends the users data to the locally-usernames collection
 * 
 */

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

/**
 * 
 * @about: check if the address is already in the database for the comment box to appear. 
 */

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

/**
 * @about: check if the user exists in the database given the username
 * 
 */

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

/**
 Returns crime statistics for a specific borough
 *DZ TESTING
 */
app.get('/api/crimeStats/:borough', async (req, res) => {
    const borough = req.params.borough;
    const filePath = boroughs[borough];

    if (!filePath) {
        return res.status(404).send('Borough not found');
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Assuming the first row is the header
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    rowData[`col${colNumber}`] = cell.value;
                });
                data.push(rowData);
            }
        });

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error reading crime statistics');
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