import axios from "axios";
import { PokemonAPI } from "./api/PokemonAPI";
import { IUser } from "./IUser";
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://dittodev:Hu7kTUgtKol1NDI3@itproject.x3zaj.mongodb.net/ITProject?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let pikachu:Pokemon={
    id:25,
    name:"pikachu"
}

export interface Pokemon{
    id?:number,
    name:string
}

export const getUser = async(sessionToken: string) => 
{
    let output;
    try
    {
        await client.connect();
        const repo = await client.db("ITProject");
        const collection = await repo.collection("pokemons")

        output = await collection.findOne({sessionToken: sessionToken});
    }
    catch
    {

    }
    finally
    {
        client.close();
        return output;
    }
}

export const updateUser = async(user: IUser) => 
{
    let output;
    try
    {
        console.log("updating user");
        console.dir(user.currentPokemonId);
        await client.connect();
        const repo = await client.db("ITProject");
        const collection = await repo.collection("pokemons")

        await collection.updateOne({_id: user._id}, {
            $set: {
                capturedPokemon: user.capturedPokemon,
                currentPokemonId: user.currentPokemonId
            }
        });
    }
    catch
    {

    }
    finally
    {
        client.close();
        return output;
    }
}

export const setUser = async(user: IUser) => 
{
    let output;
    try
    {
        await client.connect();
        const repo = await client.db("ITProject");
        const collection = await repo.collection("pokemons")

        output = await collection.insertOne(user);
    }
    catch
    {

    }
    finally
    {
        client.close();
        return output;
    }
}

let insertUser = async (pokemon) => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Client connected!")
        // DBCalls
        await client.db("ITProject").collection("pokemons").insertOne(pikachu);
        console.log("DBCalls done!")
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Client closed!")
    }
}

export const releasePokemon = async (pokemonId: number) => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Client connected!")
        // DBCalls
        await client.db("ITProject").collection("pokemons").deleteOne({id: pokemonId});
        console.log("DBCalls done!")
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Client closed!")
    }
}

async function test() {
    const user: IUser = await getUser("");
    user.capturedPokemon.push({
        id: 1,
        name: "tester"
    });
    await updateUser(user);

    console.dir(await getUser(""));
}

test();
