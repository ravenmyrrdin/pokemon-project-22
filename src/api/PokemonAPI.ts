import axios from "axios";
import { Pokemon } from "./Pokemon";
import { PokemonGame } from "./PokemonGame";
import { SpriteType } from "./SpriteType";


export class PokemonAPI 
{
    public async getByName(name: string): Promise<Pokemon>
    {
      const apiData =  (await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)).data;
      const pokemon: Pokemon = new Pokemon(apiData);

      return pokemon;
    }
    
    public async getById(id: number)
    {
      return (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));
    }
}


new PokemonAPI().getByName("ditto").then(p => {
  console.log(`ID: ${p.id}`);
  console.log(`Name: ${p.name}`);
  console.log(`Weight: ${p.weight}`);
  console.log(`Abilities: ${JSON.stringify(p.abilities)}`);
  
  console.log("Front Normal: " + p.getFrontSprite(PokemonGame.FireredLeafgreen));
  console.log("Front Shiny: " + p.getFrontSprite(PokemonGame.FireredLeafgreen, SpriteType.Shiny));
  console.log("Back Normal: " + p.getBackSprite(PokemonGame.FireredLeafgreen));
  console.log("Back Shiny: " + p.getBackSprite(PokemonGame.FireredLeafgreen, SpriteType.Shiny));
});