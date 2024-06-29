import { describe, expect, it } from "bun:test";
import { CNPJ } from "@core/domain/entity/CNPJ";

describe("CNPJ", () => {
  it.each([
    "50.340.721/0001-19",
    "38.798.876/0001-06",
    "17.647.539/0001-30",
    "03.534.978/0001-21"
  ])("should return true for valid CNPJ: %s", (validCNPJ) => {
    expect(new CNPJ(validCNPJ)).toBeInstanceOf(CNPJ);
  });

  it.each([
    '12.345.678/9012-34',
    '11.111.111/1111-11',
    '22.222.222/2222-22',
    '33.333.333/3333-33',
    '44.444.444/4444-44',
    '55.555.555/5555-55',
    '66.666.666/6666-66',
    '77.777.777/7777-77',
    '88.888.888/8888-88',
    '99.999.999/9999-99',
    '00.000.000/0000-00',
    'abcdefghijklmno',
    '12.345.678/9012-345',
  ])("should throw an error when CNPJ is invalid: %s", (invalidCNPJ) => {
    expect(() => {
      new CNPJ(invalidCNPJ);
    }).toThrowError("Invalid CNPJ");
  })
});
