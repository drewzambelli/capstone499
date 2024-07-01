require('dotenv').config();
const { MongoClient } = require("mongodb");
const express = require('express')

const app = express()
const port = 3000

const user = process.env.MONGO_USERNAME;
const pass = process.env.MONGO_PASSWORD;

const username = encodeURIComponent(user);
const password = encodeURIComponent(pass);

async function testConnection(){
    const uri = `mongodb+srv://${username}:${password}@locally-cluster-1.crkbqzb.mongodb.net/?retryWrites=true&w=majority&appName=locally-cluster-1`;
    console.log(uri)
    const client = new MongoClient(uri);
    let conn;
    try {
        conn = await client.connect();
        const database = client.db('capstone')
        const locally = database.collection('locally')
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
        else console.log(result)
    }catch(e){
        console.log(e)
    }
})

app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})