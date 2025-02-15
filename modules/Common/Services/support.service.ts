import { ChangeEvent } from "react";

const supportService = {
  formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Sao_Paulo",
    };

    return new Date(dateString).toLocaleDateString("pt-BR", options);
  },
  formatDateTime(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    };
    const date = new Date(dateString).toLocaleDateString("pt-BR", options);

    const [datePart, timePart] = date.split(" ");

    const [day, month, year] = datePart.split("/");
    const formattedDate = `${day}/${month}/${year}`;

    return `${formattedDate} ${timePart}`;
  },

  formatDateTimeFull(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  },
  formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },
  formatCNPJ(cnpj: string) {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  },
  formatPostalCode(postalCode: string) {
    return postalCode.replace(/(\d{5})(\d{3})/, "$1-$2");
  },
  haveSameElements(arr1: unknown[], arr2: unknown[]) {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  },
  isEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
    const obj1Keys = Object.keys(obj1);

    return obj1Keys.every((key) => {
      return obj1[key] == obj2[key];
    });
  },
  removeEmptyValues<T extends object>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (key === "value" && value === 0) {
          return [key, undefined];
        }
        if (
          value === null ||
          value === "" ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return [key, undefined];
        }

        return [key, value];
      }),
    ) as T;
  },
  mountParams(params: Record<string, string>) {
    const formattedParams: Record<string, string> = {};
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        formattedParams[key] = params[key];
      }
    });
    return formattedParams;
  },
  getImageData(event: ChangeEvent<HTMLInputElement>) {
    const dataTransfer = new DataTransfer();
    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image),
    );
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return displayUrl;
  },
};

export default supportService;
