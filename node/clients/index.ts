import { IOClients } from '@vtex/api'

import { PokemonClient } from './pokemon'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get pokemon() {
    return this.getOrSet('pokemon', PokemonClient)
  }
}
