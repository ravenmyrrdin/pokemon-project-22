import { IPokemonStat } from "./api/IPokemonStat";
import { Pokemon } from "./api/Pokemon";
import { PokemonAPI } from "./api/PokemonAPI";

const express = require("express");
const app = express();
const api = new PokemonAPI();
app.set("port", 8080 || process.env.PORT);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/pokemon", async (req: any, res: any) => {
  
  const gen1:Pokemon[] = [];
  for(let i = 1;i<10;i++){
    gen1.push(await api.getById(i));
  }
  res.render("pokemon",{
    "pokemons": [gen1]
  });
});

app.get("/catch", (req: any, res: any) => {
  res.render("catch");
});

app.get("/popup", (req: any, res: any) => {
  res.render("popup");
});

app.get("/vergelijking", async (req: any, res: any) => {
  const pokemon = await api.getById(1);

  res.render("vergelijking", { attackA: pokemon.baseExperience });
});

app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
