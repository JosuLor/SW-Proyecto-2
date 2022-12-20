export { fetchJSON };

async function fetchJSON(file) {
  let result = fetch(`./json/${file}`).then((r) => r.json());
  return result;
}
