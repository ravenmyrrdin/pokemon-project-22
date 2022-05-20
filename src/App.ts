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
  const pokemons:Pokemon[] =[];
  for(let i =1;i<25;i++){
    const pokemon = await api.getById(i);
    console.log(pokemon.id + " " + pokemon.name);
    pokemons.push(pokemon);
  }
  res.render("pokemon", {
    pokemons: await pokemons,
  });
});

// app.get("/catch", (req: any, res: any) => {
//   res.render("catch");
// });

app.get("/catch/:index", async (req: any, res: any) => {
  const index = req.params.index;
  // if (index > 0 && index != null) {
  //   const pokemon: Pokemon = await api.getById(index);
  //   res.render("catching", { pokemon: await pokemon });
  // } else {
  //   res.render("404")
  // }
  const pokemon: Pokemon = await api.getById(index);
  try {
  res.render("catching", { pokemon: await pokemon });
  } catch (err) {console.error(err);}
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
