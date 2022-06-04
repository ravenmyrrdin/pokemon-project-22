import { ObjectId } from "mongodb";
import { Pokemon } from "./Database";

export interface IUser
{
    _id?: ObjectId,
    sessionToken: string, 
    capturedPokemon: Pokemon[],
    currentPokemonId: number
    multiplier: number;
}