/* eslint-disable padding-line-between-statements */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useCssHandles } from 'vtex.css-handles'
import styles from './styles/pokemon.module.css'

import randomizer from './utils/randomizer'

const CSS_HANDLES = ['classList']

interface IPokemonListProps {
  quantity: number
}

interface IPokemon {
  url: string
  name: string
  image: string
  types: string[]
  abilities: string[]
}

interface IQuestion {
  index: number
  correctAnswer: string
  selectedAnswer: string | null
  isCorrect: boolean | null
}

function PokemonList({ quantity = 5 }: IPokemonListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pokemons, setPokemons] = useState<IPokemon[]>([])
  const [questions, setQuestions] = useState<IQuestion[] | null>(null)

  const styleHandles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    if (!pokemons.length) return
    const questionsArr = pokemons.map((pokemon: IPokemon, index) => {
      const question = {
        index,
        correctAnswer: pokemon.name,
        selectedAnswer: null,
        isCorrect: null,
      }

      return question
    })
    setQuestions(questionsArr)
  }, [pokemons])

  useEffect(() => {
    const url = `/_v/pokemon-list/${quantity + 15}`
    const getList = async () => {
      const response = await axios.get(url)
      const pokemonsArr = response.data.results
      const promises = pokemonsArr.map((pokemon: IPokemon) =>
        axios.get(`/_v/pokemon/${pokemon.name}`)
      )
      const result = await Promise.all(promises)
      const pokemonsResult = pokemonsArr.map((pokemon: IPokemon) => {
        const pokemonData = result.filter(
          ({ data }: any) => data.name === pokemon.name
        )[0] as any

        const { data } = pokemonData
        return {
          ...pokemon,
          image: data.sprites.front_default,
          abilities: data.abilities.map(({ ability }: any) => ability.name),
          types: data.types.map(({ type }: any) => type.name),
        }
      })
      setPokemons(randomizer(pokemonsResult))
      setIsLoading(false)
    }
    getList()
  }, [quantity])

  const buttons = useCallback((pokemonsArray: IPokemon[]): string[] => {
    return pokemonsArray.map((pokemon) => {
      const randomElement = () =>
        pokemonsArray[Math.floor(Math.random() * pokemonsArray.length)]
      const arr: any = []
      for (let i = 0; i <= 1; i++) {
        let newPokemonName = randomElement().name
        // eslint-disable-next-line no-loop-func
        while (arr.some((string: string) => string === newPokemonName)) {
          newPokemonName = randomElement().name
        }

        arr.push(randomElement().name)
      }
      arr.push(pokemon.name)
      return randomizer(arr)
    })
  }, [])

  const memoizedButtons = useMemo((): string[] => buttons(pokemons), [
    buttons,
    pokemons,
  ])

  if (isLoading) return 'Loading...'

  const handleClick = ({ target }: any, index: number) => {
    return setQuestions((prev: IQuestion[] | null) => {
      if (!prev) return null
      return prev.map((question) => {
        if (question.index !== index) return question
        return {
          ...question,
          correctAnswer: pokemons[index].name,
          selectedAnswer: target.textContent,
          isCorrect: pokemons[index].name === target.textContent,
        }
      })
    })
  }

  return (
    <ul className={`${styles.row} ${styleHandles.classList}`}>
      {pokemons?.map((pokemon: IPokemon, index) => {
        if (index > quantity - 1) return
        return (
          <li key={pokemon.name}>
            <div className={`${styles.container}`}>
              <img
                className={`${styles.img}`}
                src={pokemon.image}
                alt={pokemon.name}
              />
              <a className={`${styles.name}`} href={pokemon.url}>
                {pokemon.name}
              </a>
              <ul className={`${styles.types}`}>
                {pokemon.types.map((type) => {
                  return <li key={type}>{type}</li>
                })}
              </ul>
              <div>
                <p>Who's that Pokémon?</p>
                {memoizedButtons.map(
                  (questionsButtons: any, buttonIndex: number) => {
                    if (index !== buttonIndex) return
                    return questionsButtons.map((button: any) => {
                      return (
                        <>
                          <button
                            key={button}
                            onClick={(e) => handleClick(e, index)}
                          >
                            {button}
                          </button>
                        </>
                      )
                    })
                  }
                )}
              </div>
              {questions !== null && questions[index].isCorrect && (
                <p>You're right!</p>
              )}
            </div>
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
