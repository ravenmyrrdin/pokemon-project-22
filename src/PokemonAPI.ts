import axios from "axios";

interface Ability 
{
  name: string,
  url: string
}

class Pokemon 
{
  constructor(json: any)
  {
    console.dir(json.abilities.map((i: any) => i));
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

new PokemonAPI().getByName("ditto");