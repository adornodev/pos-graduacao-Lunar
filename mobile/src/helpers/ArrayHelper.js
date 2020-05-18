export function isArrayValid(data) {
  if (!data || !Array.isArray(data) || !(data.length > 0)) {
    return false;
  }
  return true;
}
