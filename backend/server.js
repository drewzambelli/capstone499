require('dotenv').config();
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const user = process.env.MONGO_USERNAME;
const pass = process.env.MONGO_PASSWORD;

const username = encodeURIComponent(user);
const password = encodeURIComponent(pass);

app.use(cors())
app.use(express.json())

const DataSchema = new mongoose.Schema({
    id: Number,
    username: String,
    firstname: String,
    lastname: String,
    age: Number
})

const Data = mongoose.model('Data', DataSchema);

app.post('/api/postData', async(req,res)=>{
    try{
        const db =  await testConnection();
        const body =await req.body
        if(body){
            console.log(body)
            const inputData = new Data({
                id:await db.countDocuments() + 1,
                username: body.userName,
                firstname: body.firstName,
                lastname: body.lastName,
                age: body.age
            })
            const result = await db.insertOne(inputData)
            res.status(200).send(`Data inserted with ID ${result.insertedId}`);
            console.log(`Data inserted with ID ${result.insertedId}`);
        }
    }catch(error){
        console.error(error);
        res.status(500).send("ERROR LOADING DATA")
    }
})

async function testConnection(){
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    const client = new MongoClient(uri);
    let conn;
    try {
        conn = await client.connect();
        gooseConn = await mongoose.connect(uri);
        const database = client.db('capstone');
        const locally = database.collection('locally-usernames');
        return locally;
    } catch (e) {
        console.error(e);
    }
}



app.get('/api/checkUserExists/:username', async (req,res)=>{
    try{
        let db = await testConnection();
        const checkUsername = req.params.username;
        const query = {username: checkUsername} 
        const result = await db.findOne(query);
        if(!result){console.log("NOT THERE")}
        else {
            console.log(result)
            res.status(200).send(result)
        }
    }catch(e){
        console.log(e)
    }
})

app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})
