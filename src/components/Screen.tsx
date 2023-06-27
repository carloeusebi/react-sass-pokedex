import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import PokeCard from "./PokeCard";
import { Pokemon, Result } from "../interfaces";

const Screen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const fetchPokemonDetails = async (url: string) => {
    const response = await axios.get(url);
    const { name, id, types, sprites } = response.data;
    return { name, id, type: types[0].type.name, img: sprites.front_default };
  };

  const loadPokedex = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const results = response.data.results;

      const pokemonDetails = results.map(
        async (r: Result) => await fetchPokemonDetails(r.url)
      );

      await Promise.all(pokemonDetails).then((newPokemons) => {
        setPokemons([...pokemons, ...newPokemons]);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const url: string = "https://pokeapi.co/api/v2/pokemon";
    loadPokedex(url);
  }, []);

  const renderPokemon = () =>
    pokemons.map((p) => (
      <div key={p.id}>
        <PokeCard pokemon={p} />
      </div>
    ));
  return (
    <section id="screen">
      <div id="pokedex">{renderPokemon()}</div>
      {isLoading && <Loader />}
    </section>
  );
};

export default Screen;
