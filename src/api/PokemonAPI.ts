import axios from "axios";
import { IPokemonStat } from "./IPokemonStat";
import { Pokemon } from "./Pokemon";
import { PokemonGame } from "./PokemonGame";
import { SpriteType } from "./SpriteType";

export class PokemonAPI {
  public async getByName(name: string): Promise<Pokemon> {
    const apiData = (
      await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    ).data;
    const pokemon: Pokemon = new Pokemon(apiData);

    return pokemon;
  }

  public async getById(id: number) {
    return new Pokemon(
      await (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)).data
    );
  }
}

