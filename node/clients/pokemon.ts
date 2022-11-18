import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class PokemonClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    // Entry point of our Pokemon Client:
    super('http://pokeapi.co/api/v2', context, options)
  }

  // Get the pokemons between a Range:
  public getPokemonsList = async (quantity: number) => {
    const randomIntFromInterval = (min: number, max: number): number => {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return this.http.get(
      `pokemon?limit=${quantity}&offset=${randomIntFromInterval(0, 100)}`,
      {
        headers: {
          'X-Vtex-Use-Https': 'true',
        },
      }
    )
  }

  // Get all the pokemon info, use it's name to retrieve all of it's data
  public getPokemonByName = async (pokemonName: string) => {
    return this.http.get(`/pokemon/${pokemonName}`, {
      headers: {
        'X-Vtex-Use-Https': 'true',
      },
    })
  }
}
