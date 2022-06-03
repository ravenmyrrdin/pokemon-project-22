import { PokemonGame } from "./api/PokemonGame";
import { IPokemonStat } from "./api/IPokemonStat";
import { Pokemon } from "./api/Pokemon";
import { PokemonAPI } from "./api/PokemonAPI";
import { getUser, setUser } from "./Database";

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
        currentPokemonId: 0
    });
  };

  req.user = await getUser(token);
  next();
};

const express = require("express");
const app = express();
const api = new PokemonAPI();
var cookieParser = require("cookie-parser");


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
    const pokemon = api.getById(i);
    pokemonFetchers.push(pokemon);
  }
  res.render("pokemon", {
    pokemons: await Promise.all(pokemonFetchers),
    pageId: page,
  });
});

// app.get("/catch", (req: any, res: any) => {
//   res.render("catch");
// });
let sessions: {[key: string]: number} = {};
app.get("/capture/:index", async (req: any, res: any) => {
  const sessionId = `${Math.random()}`.slice(2);
  sessions[sessionId] = 3;
  const index = req.params.index;
  const pokemon: Pokemon = await api.getById(index);
  let buddy = req.user?.capturedPokemon[req.user?.capturedPokemonId];
  try {
    res.render("capture", { pokemon: await pokemon, pokeballs: sessions[sessionId], buddy: buddy, sessionId: sessionId});
  } catch (err) {
    console.error(err);
  }
});

app.post("/capture/:index", async (req: any, res: any) => {
  
  const sessionId = req.body.sessionId;
  sessions[sessionId]--;

  const index = req.params.index;
  const pokemon: Pokemon = await api.getById(index);

  let buddy = req.user?.capturedPokemon[req.user?.capturedPokemonId];
  if(Math.random()*100 <= (100 - pokemon.getStat(IPokemonStat.Defence) + (buddy !== undefined ? buddy.getStat(IPokemonStat.Defence) : 0) ))
  {
    

    return res.send("Pokemon captured");
  }
  else
  {
    if(sessions[sessionId] <= 0)
    {
      delete sessions[sessionId];
      return res.redirect("/pokemon/0");
    }
    try {
      return res.render("capture", { pokemon: await pokemon, pokeballs: sessions[sessionId], buddy: buddy, sessionId: sessionId});
    } catch (err) {
      console.error(err);
    }
  }
  
  /*
  const index = req.params.index;
  const pokemon: Pokemon = await api.getById(index);
  let buddy = req.user.capturedPokemon[req.user.capturedPokemonId];
  try {
    res.render("capture", { pokemon: await pokemon, pokeballs: sessions[sessionId], buddy: buddy, sessionId: sessionId});
  } catch (err) {
    console.error(err);
  }
  */
});

app.get("/dashboard", (req: any, res: any) => {
  res.render("dashboard");
});

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
          ? api.getById(Number.parseInt(req.params.a))
          : api.getByName(req.params.a),
        /^[0-9]+$/.test(req.params.b)
          ? api.getById(Number.parseInt(req.params.b))
          : api.getByName(req.params.b),
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
  let data = await api.getById(req.params.id);
  let database = false;
  console.log(data)
  res.render("singlePokemon", { data: data, database: database });
});

app.listen(
  app.get("port"),
  console.log(`[SERVER]: Running on http://localhost:${app.get("port")}`)
);
