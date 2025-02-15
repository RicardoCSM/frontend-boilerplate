export const cpfRefine = (cpf: string) => {
  const cpfDigits = cpf.split("").map((el) => +el);
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const rest = (count: number): number => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
};