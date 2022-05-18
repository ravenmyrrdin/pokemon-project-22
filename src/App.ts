import { IPokemonStat } from "./api/IPokemonStat";
import { Pokemon } from "./api/Pokemon";
import { PokemonAPI } from "./api/PokemonAPI";

const express = require("express");
const app = express();
const api = new PokemonAPI();

app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/pokemon", async (req: any, res: any) => {
  const pokemonFetchers:Promise<Pokemon>[] =[];

  let page = 1;
  for(let i =(20*page)+1; i<(20*(page+1))+1;i++){
    const pokemon = api.getById(i);
    pokemonFetchers.push(pokemon);
  }
  res.render("pokemon",{
    "pokemons": await Promise.all(pokemonFetchers)
  });
});

// app.get("/catch", (req: any, res: any) => {
//   res.render("catch");
// });

app.get("/catch/:index", async (req: any, res: any) => {
  const pokemon:Pokemon = await api.getById(req.param);
  res.render("catching", {pokemon : pokemon});

});

app.get("/dashboard", (req: any, res: any) => {
  res.render("dashboard");
});

app.get("/vergelijking", async (req: any, res: any) => {
  const pokemon = await api.getById(1);
  res.render("vergelijking", { attackA: pokemon.baseExperience });
});

app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
