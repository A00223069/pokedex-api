// DOM ELEMENTS
const POKEMON_GRID = document.querySelector('#pokemon-grid');
const DETAILS = document.querySelector('#details');
const POKEDEX_REGION = document.querySelector('#current-pokedex');

// POKEDEX REGIONS
const NATIONAL = 1;
const KANTO = 2;
const JOHTO = 3;
const HOENN = 4;
const SINNOH = 5;

// ----------------------------------------------
// FETCH API INFO
// ----------------------------------------------
let pokemonArray = [];

const pokedexUrl = 'https://pokeapi.co/api/v2/pokedex/' + KANTO;

// Set title in homepage to current Pokedex region
let currentPokedex = 'Kanto';
POKEDEX_REGION.textContent = currentPokedex;

// Fetch Pokedex info from API
fetch(pokedexUrl)
  .then(x => x.json())
  .then(x => {

    // Fetch all Pokemon from Pokedex and display on page
    x.pokemon_entries.forEach(function(obj) {
      let pokemonURL = "";
      pokemonURL = 'https://pokeapi.co/api/v2/pokemon/' + obj.entry_number;
      
      fetch(pokemonURL)
        .then(x => x.json())
        .then(x => {
          // Display Pokemon on the page
          pokemonArray.push(x);
          insertPokemonCard(x.name, x.id, x.sprites.front_default);
        })
        .catch(err => {
          console.log(err);
        })
    })
  })
  .catch(err => {
    console.log(err || "this is an error");
  });

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
 * Takes a Pokemon ID and then fetches API data to fill out a details page.
 * @param {number} id The Pokemon's Pokedex ID.
 */
function displayPokemonInfo(id) {

  // Get DOM elements
  const POKEMON_NAME = document.querySelector('#pk-name');
  const TYPE_LIST = document.querySelector('#type-list');
  const SPRITE = document.querySelector('#sprite');
  const STATS = document.querySelector('#stat-list');
  const EVOLUTION = document.querySelector('#evolution-list');

  // Clear elements before populating with API data
  POKEMON_NAME.innerHTML = "";
  TYPE_LIST.innerHTML = "";
  SPRITE.innerHTML = "";
  STATS.innerHTML = "";
  EVOLUTION.innerHTML = "";

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
        type.classList.add(typeName); // for type color

        // Append types to parent container
        TYPE_LIST.appendChild(type);
      })

      // Sprite image
      let img = document.createElement('img');
      img.src = x.sprites.front_default;
      img.alt = x.name;
      SPRITE.appendChild(img);

      // Base Stats
      x.stats.forEach(function(obj) {
        let stat = document.createElement('li');
        stat.textContent = obj.stat.name + ": " + obj.base_stat;
        STATS.appendChild(stat);
      })

      // Profile
      // Height
      document.querySelector('#height').textContent = 'Height: ' + x.height / 10 + ' m';

      // Weight
      document.querySelector('#weight').textContent = 'Weight: ' + x.weight / 10 + ' kg';

      // Category & Evolution (loads after everything else because of extra API call)
      const speciesUrl = x.species.url;

      // Make another API call to get additional info not included in v2/pokemon/{id} endpoint
      fetch(speciesUrl)
        .then(x => x.json())
        .then(x => {
          document.querySelector('#category').textContent = 'Category: ' + x.genera[2].genus;

          const evolutionUrl = x.evolution_chain.url;

          fetch(evolutionUrl)
            .then(x => x.json())
            .then(x => {

              // How to access Pokemon Evolution Chain in the Pokemon API
              // Credit: https://stackoverflow.com/questions/39112862/pokeapi-angular-how-to-get-pokemons-evolution-chain

              var evoChain = [];
              var evoData = x.chain;

              do {
                var evoDetails = evoData['evolution_details'][0];
                evoChain.push({
                  "species_name": evoData.species.name,
                  "min_level": !evoDetails ? 1 : evoDetails.min_level,
                  "trigger_name": !evoDetails ? null : evoDetails.trigger.name,
                  "item": !evoDetails ? null : evoDetails.item
                });

                evoData = evoData['evolves_to'][0]; // update evoData variable to access nested "evolves_to" property
              } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

              console.log(evoChain);

              // Populate EVOLUTION section
              // Bug: will throw an error and not display if any pokemon in the evolution chain isn't included in current pokedex (because it wasn't added to global pokemonArray in initial API call)
              evoChain.forEach(function(evo) {

                const evoDiv = document.createElement('div');
                evoDiv.className = 'pokemon';

                // Get sprites for each evolution stage 
                const pokemon = pokemonArray.filter(x => x.name === evo.species_name); // returns undefined if evoChain includes a Pokemon not in pokemonArray
                const evoImg = document.createElement('img');
                evoImg.src = pokemon[0].sprites.front_default; 

                // Get name
                const evoName = document.createElement('h3');
                evoName.textContent = evo.species_name;

                // Append everything
                evoDiv.appendChild(evoImg);
                evoDiv.appendChild(evoName);
                EVOLUTION.appendChild(evoDiv);
              })
            })
            .catch(err => {
              let errorString = "This Pokemon evolves to/from a Pokemon that isn't included in the current (" + currentPokedex + ") Pokedex." // lol
              EVOLUTION.innerHTML = errorString;
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err);
        })


      // Abilities
      let abilitiesStr = [];
      x.abilities.forEach(function(obj) {
        abilitiesStr.push(obj.ability.name)
      })
      document.querySelector('#abilities').textContent = 'Abilities: ' + abilitiesStr.join(', ');


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

// ----------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------

// Back button
const backButton = document.querySelector("#back-button");

backButton.addEventListener('click', function() {
  document.querySelector("#grid-wrapper").style.display = 'block';
  DETAILS.style.display = 'none';
})