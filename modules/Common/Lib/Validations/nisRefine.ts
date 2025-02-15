export const nisRefine = (nis: string) => {
  const nisDigits = nis.split("").map((el) => +el);

  if (nis.length !== 11 || !!nis.match(/(\d)\1{10}/)) return false;

  let d = 0;
  let p = 2;
  let c = 9;
  for (c; c >= 0; c--, p < 9 ? p++ : (p = 2)) {
    d += nisDigits[c] * p;
  }

  return nisDigits[10] === ((10 * d) % 11) % 10;
};
