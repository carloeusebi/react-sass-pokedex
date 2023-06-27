import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import PokeCard from "./PokeCard";
import { Pokemon, Result } from "../interfaces";

const Screen = () => {
  const [nextUrl, setNextUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const observer = useRef<IntersectionObserver | undefined>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && nextUrl) {
          loadPokedex(nextUrl);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, nextUrl, pokemons]
  );

  const fetchPokemonDetails = async (url: string) => {
    const response = await axios.get(url);
    const { name, id, types, sprites } = response.data;
    return { name, id, type: types[0].type.name, img: sprites.front_default };
  };

  const loadPokedex = useCallback(
    async (url: string) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url);
        const results = response.data.results;
        const { next } = response.data;
        if (next) setNextUrl(next);

        const pokemonDetails = results.map(
          async (r: Result) => await fetchPokemonDetails(r.url)
        );

        await Promise.all(pokemonDetails).then(newPokemons => {
          setPokemons([...pokemons, ...newPokemons]);
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [nextUrl, pokemons]
  );

  useEffect(() => {
    const url: string = "https://pokeapi.co/api/v2/pokemon";
    loadPokedex(url);
  }, []);

  const renderPokemon = () =>
    pokemons.map(p => (
      <div key={p.id}>
        <PokeCard pokemon={p} />
      </div>
    ));

  return (
    <section id="screen">
      <div id="pokedex">{renderPokemon()}</div>
      <div ref={lastElementRef}></div>
      {isLoading && <Loader />}
    </section>
  );
};

export default Screen;
