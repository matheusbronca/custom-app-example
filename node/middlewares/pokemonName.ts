export async function pokemonByName(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { pokemon },
    vtex: {
      route: {
        params: { pokemonName },
      },
    },
  } = ctx

  const response = await pokemon.getPokemonByName(pokemonName as string)

  ctx.body = response
  ctx.status = 200
  await next()
}
