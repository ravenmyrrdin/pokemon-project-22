import axios from "axios";
import { ObjectId } from "mongodb";
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://dittodev:Hu7kTUgtKol1NDI3@itproject.x3zaj.mongodb.net/ITProject?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

interface Player {
    _id?: ObjectId,
    sessionToken: string,
    currentPokemon: number,
    capturedPokemonList: Pokemon[]
}
interface Pokemon{
    id:number,
    nickname:string
}
let doSomeDBCalls = async () => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Client connected!")
        // DBCalls
        await client.db("ITProject").collection("pokemons").insertOne();
        console.log("DBCalls done!")
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Client closed!")
    }
}
console.log();
doSomeDBCalls();



