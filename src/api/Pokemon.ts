import { IAbility } from './IAbility';
import { StringTools } from '../misc/StringTools';
import { ISprite } from './ISprite';
import { PokemonGame } from './PokemonGame';
import { SpriteType } from './SpriteType';
import { IPokemonStat } from './IPokemonStat';
/**
 * Scraped pokemon result data object
 */
export class Pokemon 
{
  /**
   * Initialize object data
   * @param json data to reflect to object
   */
  constructor(json: {[key: string]: any})
  {
    this.assignValues(json);
  }

  /**
   * Search for matching json values and bind these to the instance.
   * @param json JSON API result
   */
  private assignValues(json: {[key: string]: any}) 
  {
    let thisData: {[key: string]: any} = Object.assign({}, this);

    for(const key of Object.keys(thisData))
    {
      const sanitzedKey = key.replace("_", "");
      console.log(sanitzedKey);
      if(Object.keys(json).includes(sanitzedKey))
      {
        let binding: {[key: string]: any} = {}
        binding[key] = json[sanitzedKey];
        
        Object.assign(this, binding);
      }
    }
  }



  /** The id setter of the pokemon */
  private _id: number = -1;
  /** The id getter of the pokemon */
  public get id(): number
  {
    return this._id;
  }

  /**  Name setter of the pokemon  */
  private _name: string = "";
  /**  Name getter of the pokemon  */
  public get name(): string { return this._name; }

  /** ability setter of the pokemon */
  private _abilities: {[key: string]:any} = [];
  /** ability getter of the pokemon */
  public get abilities(): IAbility[] { return this._abilities.map((i: any) => i.ability); }

  /** default experience setter of the pokemon */
  private _baseExperience: number = -1;
  /** default experience getter of the pokemon */
  public get baseExperience(): number { return this._baseExperience; }

  /** weight setter of the pokemon */
  private _weight: number = -1;

  /** Weight getter for pokemon */
  public get weight(): number { return this._weight; }
  
  /** Sprites setter for pokemon */
  private _sprites: {[key: string]: any} = [];

  private _stats:  any[] = [];
  public getStat(stat: IPokemonStat)
  {
    return this._stats[stat].base_stat;
  }

  /** Get all sprites of the pokemon in a specific generation */
  private getSpritesFromGeneration(pokemonGame: PokemonGame): {[key: string]: string} { 
    const apiSectionString = PokemonGame[pokemonGame].split(/(?=[A-Z])/).join("-").toLowerCase();
    let generation = PokemonGame.getGeneration(pokemonGame);

    return this._sprites["versions"][`generation-${StringTools.numberToRoman(generation)}`][apiSectionString];
  }
  
  /** Get the front sprite in a specific game (default or shiny) */
  public getFrontSprite(pokemonGame: PokemonGame, spriteType: SpriteType = SpriteType.Default): string
  {
    const spriteData = this.getSpritesFromGeneration(pokemonGame);

    return spriteData["front_"+SpriteType[spriteType].toLowerCase()];
  }

  /** Get the back sprite in a specific game (default or shiny) */
  public getBackSprite(pokemonGame: PokemonGame, spriteType: SpriteType = SpriteType.Default): string
  {
    const spriteData = this.getSpritesFromGeneration(pokemonGame);

    return spriteData["back_"+SpriteType[spriteType].toLowerCase()];
  }
}
