let lastRegimeSeen: string | null = null;

export function setLastRegime(regimeId: string) {
  lastRegimeSeen = regimeId;
}

export function getLastRegime() {
  return lastRegimeSeen;
}
