export function parseKPI(value: string) {
  const numericMatch = value.match(/-?\d+(\.\d+)?/);

  if (!numericMatch) {
    return { number: null, prefix: '', suffix: value, decimals: 0 };
  }

  const number = parseFloat(numericMatch[0]);
  const prefix = value.slice(0, numericMatch.index);
  const suffix = value.slice((numericMatch.index ?? 0) + numericMatch[0].length);
  const decimals = numericMatch[0].includes('.') ? numericMatch[0].split('.')[1].length : 0;

  return { number, prefix, suffix, decimals };
}
