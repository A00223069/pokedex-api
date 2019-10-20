// DOM ELEMENTS
const POKEMON_GRID = document.querySelector('#pokemon-grid');
const DETAILS = document.querySelector('#details');

// POKEDEX REGIONS
const NATIONAL = 1;
const KANTO = 2;
const JOHTO = 3;
const HOENN = 4;
const SINNOH = 5;

// ----------------------------------------------
// POKEMON CLASS
// ----------------------------------------------
class Pokemon {
  constructor(name, id, sprite) {
    this.name = name;
    this.id = id;
    this.sprite = sprite;
  }
}

let pokemonArr = [];

// ----------------------------------------------
// FETCH API INFO
// Have to make at least 3 API calls:
// 1. Pokedex
// 2. Individual Pokemon
// 3. Evolution chain (for details page)
// ----------------------------------------------

const pokedexUrl = 'https://pokeapi.co/api/v2/pokedex/' + KANTO;

// Fetch Pokedex info from API
fetch(pokedexUrl)
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
          pokemonArr.push(new Pokemon(x.name, x.id, x.sprites.front_default))
          insertPokemonCard(x.name, x.id, x.sprites.front_default);
        })
    })
  })
  .catch(err => {
    console.log(err || "this is an error");
  })


// ----------------------------------------------
// FUNCTION DEFINITIONS
// ----------------------------------------------
/**
 * Inserts a div onto page with the Pokemon's name and image.
 * @param {string} name The Pokemon's name.
 * @param {number} pokemonId The Pokemon's Pokedex ID.
 * @param {string} imgUrl The image URL for the Pokemon's default sprite.
 */
function insertPokemonCard(name, pokemonId, imgUrl) {

  // Get parent container
  const parent = POKEMON_GRID;

  // DIV CONTAINER
  const pokemon = document.createElement('div');
  pokemon.className = 'pokemon'
  pokemon.id = pokemonId;

  // Create img element
  const pkImg = document.createElement('img');
  pkImg.src = imgUrl;
  
  // Add Pokemon name underneath image
  const pokeName = document.createElement('h2');
  pokeName.textContent = capitalizeFirstLetter(name);

  // Put div together
  pokemon.appendChild(pkImg);
  pokemon.appendChild(pokeName);

  // Attach onclick event
  pokemon.addEventListener('click', function() {
    displayPokemonInfo(this.id);
  });

  // Append card to parent div
  parent.appendChild(pokemon);
}

/**
 * Takes a Pokemon ID and then fetches corresponding data in the API.
 * @param {number} id The Pokemon's Pokedex ID.
 */
function displayPokemonInfo(id) {

  // Get DOM elements
  const POKEMON_NAME = document.querySelector('#pk-name');
  const TYPE_LIST = document.querySelector('#type-list');
  const SPRITE = document.querySelector('#sprite');
  const STATS = document.querySelector('#stat-list');
  const PROFILE = document.querySelector('#profile');
  const EVOLUTION = document.querySelector('#evolution');

  // Make API call to get Pokemon info
  let pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/' + id;

  fetch(pokemonUrl)
    .then(x => x.json())
    .then(x => {

      // Name
      POKEMON_NAME.textContent = x.name;

      // Types
      x.types.forEach(function(obj) {
        // Create div
        let type = document.createElement('div');
        let typeName = obj.type.name;
        type.textContent = typeName;

        // Add class names to style each type div
        type.classList.add('type');
        type.classList.add(typeName);

        // Append types to parent container
        TYPE_LIST.appendChild(type);
      })

      // Sprite image
      let img = document.createElement('img');
      img.src = x.sprites.front_default;
      SPRITE.appendChild(img);

      // Base Stats
      x.stats.forEach(function(obj) {
        let stat = document.createElement('li');
        stat.textContent = obj.stat.name + ": " + obj.base_stat;
        STATS.appendChild(stat);
      })

      // Profile
      

      // Clear page and display info
      document.querySelector('.grid-wrapper').style.display = 'none';
      DETAILS.style.display = 'grid';

    })
    .catch(err => {
      console.log(err);
    })
}

// ----------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function sortById(pokemonArray) {
  pokemonArray.sort(function(a, b) {

    let numA = Number(a.id);
    let numB = Number(b.id);

    if (numA < numB) {
      return -1;
    }
    else {
      return 1;
    }
  })
}