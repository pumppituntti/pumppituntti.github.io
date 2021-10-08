import fetch from "node-fetch";
var numbers = process.argv.splice(2);

async function fetchAll(numbers) {
  let obj = await Promise.all(
    numbers.map(async (id) => {
      return fetchTitle(id);
    })
  );
  return obj;
}

async function fetchTitle(id) {
  let character = await fetch(`https://swapi.dev/api/people/${id}/`);
  let characterJson = await character.json();

  let titles = await Promise.all(
    characterJson.films.map(async (url) => {
      let film = await fetch(url);
      let filmJson = await film.json();
      return filmJson.title;
    })
  );

  return {
    name: characterJson.name,
    movies: titles,
  };
}

fetchAll(numbers).then((data) => console.log(data));
