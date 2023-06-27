import React from "react";
import { Pokemon } from "../interfaces";

const PokeCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const { id, img, type } = pokemon;
  const name = pokemon.name.toUpperCase();

  return (
    <div className={`poke-card ${type}`}>
      <figure>
        <img src={img} alt={name} title={name} />
      </figure>
      <div>#{id}</div>
      <div>
        <strong>{name}</strong>
      </div>
      <div>
        <em>{type}</em>
      </div>
    </div>
  );
};

export default PokeCard;
