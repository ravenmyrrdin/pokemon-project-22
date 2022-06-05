import { ObjectId } from "mongodb";
import { ICapturedPokemon } from "./Database";

export interface IUser
{
    _id?: ObjectId,
    sessionToken: string, 
    capturedPokemon: ICapturedPokemon[],
    currentPokemonId: number,
    playerBoost?: number
}