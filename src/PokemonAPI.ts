import axios from "axios";

class PokemonAPI 
{
    public async getByName(name: string) 
    {
      return (await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)).data;
    }
    
    public async getById(id: number)
    {
      return (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));
    }


}

new PokemonAPI().getByName("ditto").then(i => console.log(i));