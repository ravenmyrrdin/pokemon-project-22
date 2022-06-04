import { PokemonGame } from "./api/PokemonGame";
import { Pokemon } from "./api/Pokemon";
import { getUser, setUser, updateUser } from "./db/Database";
import IPokemonStat from "./api/IPokemonStat";
import PokemonAPI from "./api/PokemonAPI";

const setupSession = async(req, res, next) => {
  let token = req.cookies.sessionToken;
  if (!token) {
    let days = 365;
    let token = `${Math.random()}`.slice(2);
    res.cookie("sessionToken", token, {
      maxAge: 24 * 60 * 60 * 1000 * days,
      httpOnly: true,
    });

    await setUser({
        sessionToken: token,
        capturedPokemon: [],
        currentPokemonId: 0,
        playerBoost: 0
    });
  };

  req.user = await getUser(token);
  next();
};

const express = require("express");
const app = express();
const fs = require('fs');
var cookieParser = require('cookie-parser')
var pokemon: Pokemon= null;

app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(setupSession);

app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.get("/pokemon", async (req: any, res: any) => res.redirect("/pokemon/0"));
app.get("/pokemon/:page", async (req: any, res: any) => {
  if (isNaN(Number.parseInt(req.params.page)))
    return res.redirect("/pokemon/0");

  const pokemonFetchers: Promise<Pokemon>[] = [];
  let page = Number.parseInt(req.params.page);
  let itemsOnPage = 30;
  for (let i = itemsOnPage * page + 1; i < itemsOnPage * (page + 1) + 1; i++) {
    const pokemon = PokemonAPI.getById(i);
    pokemonFetchers.push(pokemon);
  }
  res.render("pokemon", {
    pokemons: await Promise.all(pokemonFetchers),
    pageId: page,
    capturedPokemon: req.user?.capturedPokemon ? req.user?.capturedPokemon.map(i => i.id) : [],
    buddyId: req.user?.currentPokemonId
  });
});

// app.get("/catch", (req: any, res: any) => {
//   res.render("catch");
// });
interface BattleSession { 
  pokemonId: number, 
  pokeballsLeft: number,
  success: boolean
}

let battleSessions: {[key: string]: BattleSession} = {};
app.get("/capture/:index", async (req: any, res: any) => {
  const sessionId = `${Math.random()}`.slice(2);
  const index = Number.parseInt(req.params.index);
  battleSessions[sessionId] = {
    pokemonId: index, 
    pokeballsLeft: 3,
    success: false
  };

  const pokemon: Pokemon = await PokemonAPI.getById(index);
  
  let buddy = req.user?.currentPokemonId != 0 ? await PokemonAPI.getById(req.user.currentPokemonId) : undefined;
  let captureChance = (100 - pokemon.getStat(IPokemonStat.Defence) + ((buddy !== undefined ? buddy.getStat(IPokemonStat.Attack) : 0)+(req.user?.playerBoost ? req.user.playerBoost : 0)));
  try {
    res.render("capture", { pokemon: await pokemon, pokeballs: battleSessions[sessionId].pokeballsLeft, buddy: buddy, sessionId: sessionId, chance: captureChance});
  } catch (err) {
    console.error(err);
  }
});

app.post("/capture/:index", async (req: any, res: any) => {
  
  const sessionId = req.body.sessionId;
  battleSessions[sessionId].pokeballsLeft--;

  const index = Number.parseInt(req.params.index);
  const pokemon: Pokemon = await PokemonAPI.getById(index);

  let buddy = req.user?.currentPokemonId != 0 ? await PokemonAPI.getById(req.user.currentPokemonId) : undefined;
  let captureChance = (100 - pokemon.getStat(IPokemonStat.Defence) + ((buddy !== undefined ? buddy.getStat(IPokemonStat.Attack) : 0)+(req.user?.playerBoost ? req.user.playerBoost : 0)));
  battleSessions[sessionId].success = Math.random()*100 <= captureChance;
  if(battleSessions[sessionId].success)
  {
    return res.redirect("/captured/"+sessionId);
  }
  else
  {
    if(battleSessions[sessionId].pokeballsLeft <= 0)
    {
      return res.redirect("/pokemon/0");
    }
    try {
      return res.render("capture", { pokemon: await pokemon, pokeballs: battleSessions[sessionId].pokeballsLeft, buddy: buddy, sessionId: sessionId, chance: captureChance});
    } catch (err) {
      console.error(err);
    }
}
});

app.get("/captured/:sessionId", async(req, res) => {
  const battleSessionData= battleSessions[req.params.sessionId];
  if(battleSessionData)
  {
    if(battleSessionData.success)
      res.render("captured", {pokemon: await PokemonAPI.getById(battleSessionData.pokemonId)});
    else res.send("Nice try");
  } else res.redirect("/");
});
app.post("/captured/:sessionId", async(req, res) => {
  const sessionData = battleSessions[req.params.sessionId];
  if(sessionData)
  {
    console.dir(sessionData);
    if(sessionData.success)
    {
      req.user.capturedPokemon.push({
        id: sessionData.pokemonId,
        name: req.body.bijnaam.length ? req.body.bijnaam : (await PokemonAPI.getById(sessionData.pokemonId)).name
      });
      await updateUser(req.user);
    } else return res.send("Nice try");

    return res.redirect("/pokemon-detail/"+sessionData.pokemonId);
  } else return res.send("invalid session");

});



app.get("/dashboard", (req: any, res: any) => {
  res.render("dashboard", {buddy: req.user?.capturedPokemon.filter(i => i.id === req.user.currentPokemonId)[0]});
});

let whoIsThatSessions: {[key: string]: string} = {}
app.get("/addboost/:session/:name", async(req: any, res: any) => 
{
  if(Object.keys(whoIsThatSessions).includes(req.params.session))
  {
    if(whoIsThatSessions[req.params.session] == req.params.name)
    {
      delete whoIsThatSessions[req.params.session];
      if(req.user.playerBoost)
        req.user.playerBoost++;
      else req.user.playerBoost = 1;

      await updateUser(req.user);
    } else return res.send("Nice try, 'mr hacker'");
  }
  return res.send("<script type='text/javascript'>window.location.href = document.referrer;</script>");
});
app.get("/whosthatpokemon", async (req: any, res: any) => {
  //json writing
    //Json flag
    const writeJson = false;
    var pokeNames: string[] = [];

    if(writeJson){
      

      for (let i = 1; i < 898; i++) {
        const pokeName = (await PokemonAPI.getById(i)).name;
        pokeNames.push(pokeName);
      }
  
      let json = JSON.stringify(pokeNames);
      fs.writeFile('./json/pokemons.json', json, function(err, result) {
        if(err) console.log('error', err);
      });
    }else{
      pokeNames = require('./json/pokemons.json');
    }
  
  const getal = Math.floor((Math.random()*897)+1);
  pokemon = await PokemonAPI.getById(getal);
  const sessionId= `${Math.random()}`.slice(2);

  try{
    whoIsThatSessions[sessionId] = pokemon.name;
    res.render("whosthat", {pokemon: pokemon,pokeNames: pokeNames, sessionId: sessionId});
  }catch (err){ 
    console.error(err);
  }

});

app.post("/vergelijking/:a/:b", async (req: any, res: any) =>  res.redirect(`/vergelijking/${req.body.aIdentifier}/${req.body.bIdentifier}`));
app.get("/vergelijking", async (req: any, res: any) =>
  res.redirect("/vergelijking/1/2")
);
app.post("/vergelijking/:a/:b", async (req: any, res: any) =>
  res.redirect(`/vergelijking/${req.body.aIdentifier}/${req.body.bIdentifier}`)
);
app.get("/vergelijking/:a/:b", async (req: any, res: any) => {
  // Catch promise rejections using map -> p.catch aka then equivalent, and map results to undefined if reject or value if resolved.
  const [pokemonA, pokemonB] = (
    await Promise.all(
      [
        /^[0-9]+$/.test(req.params.a)
          ? PokemonAPI.getById(Number.parseInt(req.params.a))
          : PokemonAPI.getByName(req.params.a),
        /^[0-9]+$/.test(req.params.b)
          ? PokemonAPI.getById(Number.parseInt(req.params.b))
          : PokemonAPI.getByName(req.params.b),
      ].map((p) => p.catch((e) => e))
    )
  ).map((i) => (i instanceof Error ? undefined : i));

  const responseData = {
    infoA:
      pokemonA === undefined
        ? undefined
        : {
            name: pokemonA.name,
            sprite: pokemonA.getFrontSprite(PokemonGame.DiamondPearl),
            stats: {
              attack: pokemonA.getStat(IPokemonStat.Attack),
              hp: pokemonA.getStat(IPokemonStat.HP),
              defence: pokemonA.getStat(IPokemonStat.Defence),
              specialattack: pokemonA.getStat(IPokemonStat.SpecialAttack),
              specialdefence: pokemonA.getStat(IPokemonStat.SpecialDefence),
              speed: pokemonA.getStat(IPokemonStat.SpecialDefence),
            },
          },
    infoB:
      pokemonB === undefined
        ? undefined
        : {
            name: pokemonB.name,
            sprite: pokemonB.getFrontSprite(PokemonGame.DiamondPearl),
            stats: {
              attack: pokemonB.getStat(IPokemonStat.Attack),
              hp: pokemonB.getStat(IPokemonStat.HP),
              defence: pokemonB.getStat(IPokemonStat.Defence),
              specialattack: pokemonB.getStat(IPokemonStat.SpecialAttack),
              specialdefence: pokemonB.getStat(IPokemonStat.SpecialDefence),
              speed: pokemonB.getStat(IPokemonStat.SpecialDefence),
            },
          },
  };

  // Count superior stats.
  let aCount = responseData.infoA === undefined ? -1 : 0;
  let bCount = responseData.infoB === undefined ? -1 : 0;
  if (aCount !== -1 && bCount !== -1) {
    for (let [key, value] of Object.entries(responseData.infoA)) {
      if (value < responseData.infoB[key]) bCount++;
      else aCount++;
    }
  }

  res.render("vergelijking", {
    ...responseData,
    superior: aCount > bCount ? 0 : bCount > aCount ? 1 : -1,
  });
});

  app.get("/pokemon-detail/:id", async (req: any, res: any) => {
    let data = await PokemonAPI.getById(req.params.id);
    let capturedData = req.user?.capturedPokemon.filter(i => i.id == req.params.id)[0];
    let isCurrentBuddy = req.user ? req.user.currentPokemonId == req.params.id : false;
    res.render("singlePokemon", { data: data, capturedData: capturedData, isCurrentBuddy: isCurrentBuddy});
  });


app.get("/release/:id", async (req: any, res: any) => {
  if(req.user)
  {
    // Ja typeless parse, dit vermijd de noodzaak om deze naar een nummer om te zetten ':) 
    req.user.capturedPokemon = req.user.capturedPokemon.filter(i => i.id != req.params.id);
    if(req.user.currentPokemonId == req.params.id) 
      req.user.currentPokemonId = 0;

    await updateUser(req.user);
  }

  return res.send("<script type='text/javascript'>window.location.href = document.referrer;</script>");
});



app.post("/currentPokemon", async(req: any, res: any) => {
  // if (req.body.currentPokemon != null) {
    const user = req.user;
    user.currentPokemonId = Number.parseInt(req.body.currentId);
    await updateUser(user);
// }
  return res.redirect("pokemon-detail/" + req.body.currentId);
})


app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
