import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCssHandles } from 'vtex.css-handles'
// import styles from './styles/totalItemsAvailable.module.css'

const CSS_HANDLES = ['classList']

interface IPokemonListProps {
  quantity: number
}

interface IPokemon {
  name: string
  url: string
}

function PokemonList({ quantity }: IPokemonListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pokemons, setPokemons] = useState<IPokemon[]>([])
  const styleHandles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const url = `/_v/pokemon-list/${quantity}`
    const getList = async () => {
      const response = await axios.get(url)

      setPokemons(response.data.results)
      setIsLoading(false)
    }

    // axios.get(url).then((response) => {
    //   response.data.results.map((pokemonObj: any) => {
    //     axios
    //       .get(
    //         `https://mathe--sqlipartnerfr.myvtex.com/_v/pokemon/${pokemonObj.name}`
    //       )
    //       .then((pokeResponse) => {
    //         setPokemons({
    //           name: pokemonObj.name,
    //           abilities: pokeResponse.data.abilities,
    //         })
    //       })
    //   })
    //   // setPokemons(response.data.results)
    // })
    getList()
  }, [])

  if (isLoading) return 'Loading...'

  return (
    <ul className={styleHandles.classList}>
      {pokemons?.map((pokemon: IPokemon) => {
        return (
          <li key={pokemon.name}>
            <a href={pokemon.url}>{pokemon.name}</a>
          </li>
        )
      })}
    </ul>
  )
}

PokemonList.schema = {
  title: 'List of Pokemons',
  description: 'Renders a list of pokemons',
  type: 'object',
  properties: {
    quantity: {
      title: 'Quantity',
      description: 'Quantity of cards to be rendered',
      type: 'number',
    },
  },
}

export default PokemonList
