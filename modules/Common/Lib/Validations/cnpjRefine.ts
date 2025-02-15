export const cnpjRefine = (cnpj: string) => {
  const cnpjDigits = cnpj.split("").map((el) => +el);

  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;

  let n = 0;
  for (let i = 0; i < 12; i++) {
    n += cnpjDigits[i] * (i < 4 ? 5 - i : 13 - i);
  }

  if (cnpjDigits[12] !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  n = 0;
  for (let i = 0; i <= 12; i++) {
    n += cnpjDigits[i] * (i < 5 ? 6 - i : 14 - i);
  }

  if (cnpjDigits[13] !== ((n %= 11) < 2 ? 0 : 11 - n)) return false;

  return true;
};
