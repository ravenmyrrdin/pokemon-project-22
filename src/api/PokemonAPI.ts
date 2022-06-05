import axios from "axios";
import { Pokemon } from "./Pokemon";

class PokemonAPI {
  public static async getByName(name: string): Promise<Pokemon> {
    const apiData = (
      await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    ).data;
    const pokemon: Pokemon = new Pokemon(apiData);

    return pokemon;
  }

  public static async getById(id: number) {
    return new Pokemon(
      await (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)).data
    );
  }
}

export = PokemonAPI;