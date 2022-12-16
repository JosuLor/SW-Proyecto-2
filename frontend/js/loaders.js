export { fetchJSON };

async function fetchJSON(file) {
  let result = fetch(file).then((r) => r.json());
  return result;
}
