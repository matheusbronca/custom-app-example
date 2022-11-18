export async function pokemonList(ctx: Context, next: () => Promise<unknown>) {
  const {
    clients: { pokemon },
  } = ctx

  const { quantity } = ctx.vtex.route.params
  const response = await pokemon.getPokemonsList(Number(quantity))

  ctx.body = response
  ctx.status = 200
  await next()
}
