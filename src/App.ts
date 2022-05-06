import { IPokemonStat } from "./api/IPokemonStat";
import { PokemonAPI } from "./api/PokemonAPI";
import { PokemonGame } from "./api/PokemonGame";

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

app.get("/vergelijking", async (req: any, res: any) => {
    const api = new PokemonAPI();
    const pokemonA = await api.getById(1);
    const pokemonB = await api.getById(2);

    res.render("vergelijking", { 
        "sprite": [
            pokemonA.getFrontSprite(PokemonGame.RedBlue),
            pokemonB.getFrontSprite(PokemonGame.RedBlue)
        ],
        "attack": [
            pokemonA.getStat(IPokemonStat.Attack),
            pokemonB.getStat(IPokemonStat.Attack)
        ],
        "hp": [
            pokemonA.getStat(IPokemonStat.HP),
            pokemonB.getStat(IPokemonStat.HP)
        ],
        "defence": [
            pokemonA.getStat(IPokemonStat.Defence),
            pokemonB.getStat(IPokemonStat.Defence)
        ],
        "specialattack": [
            pokemonA.getStat(IPokemonStat.SpecialAttack),
            pokemonB.getStat(IPokemonStat.SpecialAttack)
        ],
        "specialdefence": [
            pokemonA.getStat(IPokemonStat.SpecialDefence),
            pokemonB.getStat(IPokemonStat.SpecialDefence)
        ],
        "speed": [
            pokemonA.getStat(IPokemonStat.SpecialDefence),
            pokemonB.getStat(IPokemonStat.SpecialDefence)
        ]
    });
});



app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
