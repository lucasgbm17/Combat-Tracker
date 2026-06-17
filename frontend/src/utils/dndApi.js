const BASE_URL = "https://www.dnd5eapi.co/api/2014";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Erro: ${res.status}`);
}

export function getMonsters() {
  return fetch(`${BASE_URL}/monsters`).then(checkResponse);
}

export function getMonsterByIndex(monsterIndex) {
  return fetch(`${BASE_URL}/monsters/${monsterIndex}`).then(checkResponse);
}
