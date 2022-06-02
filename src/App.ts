import { PokemonGame } from './api/PokemonGame';
import { IPokemonStat } from "./api/IPokemonStat";
import { Pokemon } from "./api/Pokemon";
import { PokemonAPI } from "./api/PokemonAPI";

const checkSessionToken = (req, res, next) =>
{
  var cookie = req.cookies.cookieName;
  if(cookie === undefined)
  {
    let days = 365;
    res.cookie('sessionToken', `${Math.random()}`.slice(2), { maxAge: (24*60*60*1000)*days, httpOnly: true });
  }

  next();
}

const express = require("express");
const app = express();
const api = new PokemonAPI();
var cookieParser = require('cookie-parser')
var pokemon: Pokemon= null;

app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(checkSessionToken);

app.get("/", (req: any, res: any) => {
  // Cookies that have not been signed
  console.dir(req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  res.render("index");
});

app.get("/pokemon", async (req: any, res: any) => res.redirect("/pokemon/0"));
app.get("/pokemon/:page", async (req: any, res: any) => {
  if(isNaN(Number.parseInt(req.params.page)))
    return res.redirect("/pokemon/0");
  
  const pokemonFetchers:Promise<Pokemon>[] =[];
  let page = Number.parseInt(req.params.page);
  let itemsOnPage = 30;
  for(let i =(itemsOnPage*page)+1; i<(itemsOnPage*(page+1))+1;i++){
    const pokemon = api.getById(i);
    pokemonFetchers.push(pokemon);
  }
  res.render("pokemon",{
    "pokemons": await Promise.all(pokemonFetchers),
    "pageId": page
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

app.get("/whosthatpokemon", async (req: any, res: any) => {
  const getal = Math.floor((Math.random()*897)+1);
  pokemon = await api.getById(getal);
  try{
    res.render("whosthat", {pokemon: await pokemon});
  }catch (err){console.error(err);}
});

app.get("/vergelijking", async (req: any, res: any) => res.redirect("/vergelijking/1/2"));
app.post("/vergelijking/:a/:b", async (req: any, res: any) =>  res.redirect(`/vergelijking/${req.body.aIdentifier}/${req.body.bIdentifier}`));
app.get("/vergelijking/:a/:b", async (req: any, res: any) => {
    // Catch promise rejections using map -> p.catch aka then equivalent, and map results to undefined if reject or value if resolved.
    const [pokemonA, pokemonB] = (await Promise.all([ 
      /^[0-9]+$/.test(req.params.a) ? api.getById(Number.parseInt(req.params.a)) : api.getByName(req.params.a),
      /^[0-9]+$/.test(req.params.b) ? api.getById(Number.parseInt(req.params.b)) : api.getByName(req.params.b)
    ].map(p => p.catch(e => e)))).map(i => i instanceof Error ? undefined : i);

    const responseData = 
    { 
      "infoA": pokemonA === undefined ? undefined : {
        "name": pokemonA.name,
        "sprite": pokemonA.getFrontSprite(PokemonGame.DiamondPearl),
        "stats": 
        {
          "attack":         pokemonA.getStat(IPokemonStat.Attack),        
          "hp":             pokemonA.getStat(IPokemonStat.HP),            
          "defence":        pokemonA.getStat(IPokemonStat.Defence),       
          "specialattack":  pokemonA.getStat(IPokemonStat.SpecialAttack), 
          "specialdefence": pokemonA.getStat(IPokemonStat.SpecialDefence),
          "speed":          pokemonA.getStat(IPokemonStat.SpecialDefence),
        }
      },
      "infoB": pokemonB === undefined ? undefined : {
        "name": pokemonB.name,
        "sprite": pokemonB.getFrontSprite(PokemonGame.DiamondPearl),
        "stats": 
        {
          "attack":         pokemonB.getStat(IPokemonStat.Attack),        
          "hp":             pokemonB.getStat(IPokemonStat.HP),            
          "defence":        pokemonB.getStat(IPokemonStat.Defence),       
          "specialattack":  pokemonB.getStat(IPokemonStat.SpecialAttack), 
          "specialdefence": pokemonB.getStat(IPokemonStat.SpecialDefence),
          "speed":          pokemonB.getStat(IPokemonStat.SpecialDefence),
        }
      }
    };
    
    // Count superior stats.
    let aCount = responseData.infoA === undefined ? -1 : 0;
    let bCount = responseData.infoB === undefined ? -1 : 0;
    if(aCount !== -1 && bCount !== -1)
    {
      for(let [key, value] of Object.entries(responseData.infoA))
      {
        if(value < responseData.infoB[key])
          bCount++;
        else aCount++;
      }
    }

    res.render("vergelijking", {
      ...responseData, 
      "superior": aCount > bCount ? 0 : bCount > aCount ? 1 : -1
    }
    );
});

app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
