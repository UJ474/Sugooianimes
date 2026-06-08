const fs = require('fs');

const titles = [
  "Sousou no Frieren",
  "Fullmetal Alchemist: Brotherhood",
  "Steins;Gate",
  "One Piece Fan Letter",
  "Shingeki no Kyojin",
  "Gintama.",
  "Gintama: The Final",
  "Hunter x Hunter (2011)",
  "Gintama'",
  "Gintama: Enchousen"
];

async function fetchAll() {
  const results = [];
  for (const title of titles) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        results.push({
          title: data.data[0].title,
          synopsis: data.data[0].synopsis,
        });
      }
      await new Promise(r => setTimeout(r, 1000)); // Respect rate limit
    } catch (e) {
      console.log('error', title, e);
    }
  }
  fs.writeFileSync('jikan_synopsis.json', JSON.stringify(results, null, 2));
}

fetchAll();
