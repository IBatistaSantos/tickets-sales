import { CPF } from "@core/domain/entity/CPF";
import { describe, expect, it } from "bun:test";


describe("CPF", () => {
  it("should create a CPF", () => {
    const cpf = new CPF("123.456.789-09");
    expect(cpf).toBeInstanceOf(CPF);
    expect(cpf.value).toBe("12345678909");
  })

  it.each([
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
    '444.444.444-44',
    '555.555.555-55',
    '666.666.666-66',
    '777.777.777-77',
    '888.888.888-88',
    '999.999.999-99',
    '000.000.000-00',
    'abcdefghi12', // Invalid characters
    '123.456.789-091', 
  ])(`should throw an error when CPF is invalid: %s`, (cpf) => {
    expect(() => {
      new CPF(cpf);
    }).toThrowError("Invalid CPF");
  });
})