import { IPokemonStat } from "./api/IPokemonStat";
import { PokemonAPI } from "./api/PokemonAPI";

const express = require("express");
const app = express();
app.set("port", 8080 || process.env.PORT);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/pokemon", (req: any, res: any) => {
  res.render("pokemon");
});

app.get("/catch", (req: any, res: any) => {
  res.render("catch");
});

app.get("/popup", (req: any, res: any) => {
  res.render("popup");
});

app.get("/vergelijking", async (req: any, res: any) => {
  const api = new PokemonAPI();
  const pokemon = await api.getById(1);

  res.render("vergelijking", { attackA: pokemon.baseExperience });
});

app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
