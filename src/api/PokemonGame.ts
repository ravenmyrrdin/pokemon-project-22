export enum PokemonGame {
    RedBlue, Yellow,                         // Gen 1
    Crystal, Gold, Silver,                   // Gen 2
    Emerald, FireredLeafgreen, RubySapphire, // Gen 3
    DiamondPearl, HeartgoldSoulsilver,       // Gen 4
    BlachWhite,                             // Gen 5
    OmegarubyAlphasapphire, XY,              // Gen 6
    UltraSunUltraMoon                        // Gen 7
}

export namespace PokemonGame
{
    export function getGeneration(game: PokemonGame)
    {
        switch(game)
        {
          case PokemonGame.Yellow:
          case PokemonGame.RedBlue:
            return 1;
          case PokemonGame.Crystal:
          case PokemonGame.Silver:
          case PokemonGame.Gold:
            return 2;
          case PokemonGame.Emerald:
          case PokemonGame.FireredLeafgreen:
          case PokemonGame.RubySapphire:
            return 3;
          case PokemonGame.DiamondPearl:
          case PokemonGame.HeartgoldSoulsilver:
            return 4;
          case PokemonGame.BlachWhite: 
            return 5;
          case PokemonGame.OmegarubyAlphasapphire:
          case PokemonGame.XY:
            return 6;
          case PokemonGame.UltraSunUltraMoon:
            return 7;
        }
    }

    export function getGamesFromGeneration(generation: number) 
    {
      return {
        1 : [PokemonGame.Yellow,  PokemonGame.RedBlue],
        2 : [PokemonGame.Crystal,  PokemonGame.Silver, PokemonGame.Gold],
        3 : [PokemonGame.Emerald,  PokemonGame.FireredLeafgreen, PokemonGame.RubySapphire],
        4 : [PokemonGame.DiamondPearl, PokemonGame.HeartgoldSoulsilver],
        5 : [PokemonGame.BlachWhite],
        6 : [PokemonGame.OmegarubyAlphasapphire, PokemonGame.XY],
        7 : [PokemonGame.UltraSunUltraMoon]
      }[generation];
    }
}