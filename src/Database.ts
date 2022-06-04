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
