import { shufflePopulation } from "../../lib/shufflePopulation";

/* Update this code to simulate a simple disease model! */

/* For this simulation, you should model a *real world disease* based on some real information about it.
*
* Options are:
* - Mononucleosis, which has an extremely long incubation period.
*
* - The flu: an ideal model for modeling vaccination. The flu evolves each season, so you can model
    a new "season" of the flu by modeling what percentage of the population gets vaccinated and how
    effective the vaccine is.
* 
* - An emerging pandemic: you can model a new disease (like COVID-19) which has a high infection rate.
*    Try to model the effects of an intervention like social distancing on the spread of the disease.
*    You can model the effects of subclinical infections (people who are infected but don't show symptoms)
*    by having a percentage of the population be asymptomatic carriers on the spread of the disease.
*
* - Malaria: a disease spread by a vector (mosquitoes). You can model the effects of the mosquito population
    (perhaps having it vary seasonally) on the spread of the disease, or attempt to model the effects of
    interventions like bed nets or insecticides.
*
* For whatever illness you choose, you should include at least one citation showing what you are simulating
* is based on real world data about a disease or a real-world intervention.
*/

/**
 * Authors:
 * Teddy D. and Owen
 * What we are simulating:
 * We are simulating rabies
 * What we are attempting to model from the real world:
 * We are attempting to model the incubation period of rabies, the infection rate of rabies, and the death rate of rabies.
 * What we are leaving out of our model:
 * We are leaving out the real world vaccine for rabies instead we will simulate it withing a population without access to a vaccine.
 * What elements we have to add:
 * We will have to add a factor of animals that can carry rabies and infect humans. We will also have to add the incubation period which is not yet implemented.
 * What parameters we will allow users to "tweak" to adjust the model:
 * We will allow users to tweak the death rate, the infection rate, the amount of infected animals and the incubation period
 * In plain language, what our model does:
 * Our model will simulate the spread of rabies within a population and the number of deaths that occur from rabies.
 */

// Default parameters -- any properties you add here
// will be passed to your disease model when it runs.

export const defaultSimulationParameters = {
  infectionChance: 50,
  deathRate: 2,
  biteChance: 5, // New parameter for bite chance
  // Add any new parameters you want here with their initial values
  //  -- you will also have to add inputs into your jsx file if you want
  // your user to be able to change these parameters.
};

/* Creates your initial population. By default, we *only* track whether people
are infected. Any other attributes you want to track would have to be added
as properties on your initial individual. 

For example, if you want to track a disease which lasts for a certain number
of rounds (e.g. an incubation period or an infectious period), you would need
to add a property such as daysInfected which tracks how long they've been infected.

Similarily, if you wanted to track immunity, you would need a property that shows
whether people are susceptible or immune (i.e. succeptibility or immunity) */
export const createPopulation = (size = 1600, animalCount = 100) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      type: "human",
    });
  }
  // Add animals to the population
  for (let i = 0; i < animalCount; i++) {
    population.push({
      id: size + i,
      x: Math.random() * 100, // Random X-coordinate within 100 units
      y: Math.random() * 100, // Random Y-coordinate within 100 units
      infected: false,
      type: "animal",
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

// Example: Maybe infect a person or an animal (students should customize this)
const updateIndividual = (person, contact, params) => {
  // Add some logic to update the individual!
  // For example...
  if (person.infected) {
    // If they were already infected, they are no longer
    // newly infected :)
    person.newlyInfected = false;
  }
  if (contact.infected) {
    if (Math.random() * 100 < params.infectionChance) {
      if (!person.infected) {
        person.newlyInfected = true;
      }
      person.infected = true;
    }
  }
};

// Example: Update population (students decide what happens each turn)
export const updatePopulation = (population, params) => {
  // Separate animals and humans
  const animals = [];
  const humans = [];
  for (let i = 0; i < population.length; i++) {
    if (population[i].type === "animal") {
      animals.push(population[i]);
    } else {
      humans.push(population[i]);
    }
  }

  // Pair each animal with a random human and apply bite logic
  for (let i = 0; i < animals.length; i++) {
    const randomIndex = Math.floor(Math.random() * humans.length);
    const randomHuman = humans[randomIndex];
    if (Math.random() * 100 < params.biteChance) {
      if (!randomHuman.infected) {
        randomHuman.newlyInfected = true;
      }
      randomHuman.infected = true;
    }

    // Visually pair the animal and the human
    if (randomHuman.x < 1) {
      randomHuman.x += Math.ceil(Math.random() * 5);
    }
    if (randomHuman.x > 99) {
      randomHuman.x -= Math.ceil(Math.random() * 5);
    }
    randomHuman.x -= 1; // human moves over
    animals[i].x = randomHuman.x + 2; // animal moves next to human
    animals[i].y = randomHuman.y;
    randomHuman.partner = animals[i];
    animals[i].partner = randomHuman;
  }

  // Update the rest of the population
  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    if (p.infected && !p.dead) {
      // Check if the person dies this round
      if (Math.random() * 100 < params.deathRate) {
        p.dead = true;
      }
    }
  }

  return population;
};

// Stats to track (students can add more)
// Any stats you add here should be computed
// by Compute Stats below
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Total Dead", value: "dead" },
  { label: "Total Infected Animals", value: "infectedAnimals" },
];

// Example: Compute stats (students customize)
export const computeStatistics = (population, round) => {
  let infected = 0;
  let newlyInfected = 0;
  let dead = 0;
  let infectedAnimals = 0;
  for (let p of population) {
    if (p.dead) {
      dead += 1;
    }
  }
  for (let p of population) {
    if (p.infected) {
      if (p.type === "human") {
        infected += 1; // Count the infected humans
      } else if (p.type === "animal") {
        infectedAnimals += 1; // Count the infected animals
      }
    }
    if (p.newlyInfected) {
      newlyInfected += 1; // Count the newly infected
    }
  }
  return { round, infected, newlyInfected, dead, infectedAnimals };
};
