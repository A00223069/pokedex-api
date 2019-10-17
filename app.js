// NEED A LOADING SCREEN

// LIST ALL POKEMON IN THE KANTO POKEDEX
const pokedex = 'https://pokeapi.co/api/v2/pokedex/2';

fetch(pokedex)
  .then(x => x.json())
  .then(x => {
    // Display Pokemon in a list
    x.pokemon_entries.forEach(function(obj) {
      let pokemonURL = "";
      pokemonURL = 'https://pokeapi.co/api/v2/pokemon/' + obj.entry_number;
      
      fetch(pokemonURL)
        .then(x => x.json())
        .then(x => {
          // Display Pokemon on the page
          insertPokemonCard(x.sprites.front_default, x.id);
        })
    })
  })
  .catch(err => {
    console.log(err || "this is an error");
  })

function insertPokemonCard(imgUrl, pokemonId) {

  // Get parent container
  const parent = document.querySelector('#pokemon-container');

  // 1. Create container
  const pokemon = document.createElement('div');
  pokemon.className = 'pokemon'
  pokemon.id = pokemonId;

  // 2. Create img element
  const pkImg = document.createElement('img');
  pkImg.src = imgUrl;

  // 3. Append image to div
  pokemon.appendChild(pkImg);

  // Attach onclick event
  pokemon.addEventListener('click', function() {
    displayPokemonInfo(this.id); // What is "this" referring to?????????
  });

  // Append card to parent div
  parent.appendChild(pokemon);
}

function displayPokemonInfo(id) {
  let pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/' + id;

  fetch(pokemonUrl)
    .then(x => x.json())
    .then(x => {

      // Display Pokemon info here
      let pokemonInfo = document.createElement('div');
      let pokemonName = document.createElement('h1');
      pokemonName.textContent = x.name;

      pokemonInfo.appendChild(pokemonName);

      // Clear container to PAVE THE WAY FOR INFOOOOOOOOOOOOO
      document.querySelector('.pokemon-container').style.display = 'none';
      document.querySelector('.pokemon-info').textContent = x.name;

    })
    .catch(err => {
      console.log(err);
    })
}