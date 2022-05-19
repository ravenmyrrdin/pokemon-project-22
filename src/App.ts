import { IPokemonStat } from "./api/IPokemonStat";
import { Pokemon } from "./api/Pokemon";
import { PokemonAPI } from "./api/PokemonAPI";
import { PokemonGame } from "./api/PokemonGame";

const express = require("express");
const app = express();
const api = new PokemonAPI();

app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/pokemon", async (req: any, res: any) => {
  const pokemons:Pokemon[] =[];
  for(let i =1;i<21;i++){
    const pokemon = await api.getById(i);
    console.log(pokemon.id+" "+pokemon.name);
    pokemons.push(pokemon);
  }
  res.render("pokemon",{
    "pokemons": await pokemons
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


app.get("/vergelijking", async (req: any, res: any) => res.redirect("/vergelijking/1/2"));
app.post("/vergelijking/:a/:b", async (req: any, res: any) =>  res.redirect(`/vergelijking/${req.body.aIdentifier}/${req.body.bIdentifier}`));
app.get("/vergelijking/:a/:b", async (req: any, res: any) => {
    const api = new PokemonAPI();
    
    // Catch promise rejections using map -> p.catch aka then equivalent, and map results to undefined if reject or value if resolved.
    const [pokemonA, pokemonB] = (await Promise.all([ 
      /^[0-9]+$/.test(req.params.a) ? api.getById(Number.parseInt(req.params.a)) : api.getByName(req.params.a),
      /^[0-9]+$/.test(req.params.b) ? api.getById(Number.parseInt(req.params.b)) : api.getByName(req.params.b)
    ].map(p => p.catch(e => e)))).map(i => i instanceof Error ? undefined : i);

    res.render("vergelijking", 
    { 
        "name":           [ pokemonA?.name,                                 pokemonB?.name ],
        "sprite":         [ pokemonA?.getFrontSprite(PokemonGame.RedBlue),  pokemonB?.getFrontSprite(PokemonGame.RedBlue) ],
        "attack":         [ pokemonA?.getStat(IPokemonStat.Attack),         pokemonB?.getStat(IPokemonStat.Attack) ],
        "hp":             [ pokemonA?.getStat(IPokemonStat.HP),             pokemonB?.getStat(IPokemonStat.HP) ],
        "defence":        [ pokemonA?.getStat(IPokemonStat.Defence),        pokemonB?.getStat(IPokemonStat.Defence) ],
        "specialattack":  [ pokemonA?.getStat(IPokemonStat.SpecialAttack),  pokemonB?.getStat(IPokemonStat.SpecialAttack) ],
        "specialdefence": [ pokemonA?.getStat(IPokemonStat.SpecialDefence), pokemonB?.getStat(IPokemonStat.SpecialDefence) ],
        "speed":          [ pokemonA?.getStat(IPokemonStat.SpecialDefence), pokemonB?.getStat(IPokemonStat.SpecialDefence) ]
    }
    );
});



app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
