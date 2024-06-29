import { ValidationError } from "../errors/ValidationError";

export class CNPJ {
  private _value: string;

  constructor(private readonly cnpj: string) {
    this._value = this.sanitizeInput(cnpj, "./-");
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!this.validateCNPJ()) {
      throw new ValidationError("Invalid CNPJ");
    }
  }

  private validateCNPJ() {
    const stripped = this.strip(this._value);
    if (!stripped) return false;

    if (stripped.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(this._value)) return false;

    let numbers = stripped.substring(0, 12);
    numbers += this.verifierDigit(numbers);
    numbers += this.verifierDigit(numbers);

    return numbers.substring(-2) === stripped.substring(-2);
  }

  private strip(number: string) {
    const regex: RegExp = /[^\d]/g;
    return (number || "").replace(regex, "");
  }

  private verifierDigit(digits: string) {
    let index = 2;
    const reverse = digits
      .split("")
      .reduce((buffer: number[], number: string) => {
        return [parseInt(number, 10)].concat(buffer);
      }, []);

    const sum = reverse.reduce((buffer: number, number: number) => {
      buffer += number * index;
      index = index === 9 ? 2 : index + 1;
      return buffer;
    }, 0);

    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  }

  private sanitizeInput(input: string, charsToRemove: string) {
    if (!input) throw new ValidationError("CNPJ is required");
    const regex = new RegExp(`[${charsToRemove}]`, "g");
    return input.replace(regex, "");
  }
}
