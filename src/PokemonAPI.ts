import axios from "axios";
import { debug } from "console";
import { Globals } from "./misc/Globals";
import { StringTools } from "./misc/StringTools";

interface IAbility 
{
  name: string,
  url: string
}

interface ISprites {
  back_default?: string;
  back_female?: string;
  back_shiny?: string;
  back_shiny_female?: string;
  front_default?: string;
  front_female?: string;
  front_shiny?: string;
  front_shiny_female?: string;
}


class Pokemon 
{
  constructor(json: any)
  {
    this._id = json.id;
    this._name = json.name;
    this._abilities = json.abilities.map((i: any) => i.ability);
    this._weight = json.weight;
    this._sprites = json.sprites.versions;

    console.dir(json);
  }

  private _id: number = -1;
  public get id(): number
  {
    return this._id;
  }

  private _name: string = "";
  public get name(): string
  {
    return this._name;
  }

  private _abilities: IAbility[] = [];
  public get abilities(): IAbility[]
  {
    return this._abilities;
  }

  private _baseExperience: number = -1;
  public get baseExperience(): number
  {
    return this._baseExperience;
  }

  private _weight: number = -1;
  public get weight(): number
  {
    return this._weight;
  }

  private _sprites: any;
  public getSprites(generation: number)
  {
    return this._sprites[`generation-${StringTools.numberToRoman(generation)}`];
  }
}

class PokemonAPI 
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
  console.log(`Abilities: ${JSON.stringify(p.weight)}`);
  console.log(`Sprites (GEN 1): ${JSON.stringify(p.getSprites(1))}`);

});