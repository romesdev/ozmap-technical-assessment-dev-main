export function calculateSkipNumber(page: number, limit: number) {
  const skip = (page - 1) * limit;

  return skip;
}
