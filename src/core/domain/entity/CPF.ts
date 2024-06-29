import { ValidationError } from "../errors/ValidationError";

export class CPF {
  private _value: string;
  constructor(private readonly cpf: string) {
    this._value = this.sanitizeInput(cpf, ".-");
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!this.validateCPF()) {
      throw new ValidationError("Invalid CPF");
    }
  }

  private validateCPF() {
    if (this._value.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(this._value)) return false;

    const firstDigit = this.calculateDigit(11, 9);
    if (firstDigit !== parseInt(this._value.substring(9, 10), 10)) return false;

    const secondDigit = this.calculateDigit(12, 10);
    if (secondDigit !== parseInt(this._value.substring(10, 11), 10))
      return false;

    return true;
  }

  private calculateDigit = (factor: number, max: number) => {
    let sum = 0;
    for (let i = 1; i <= max; i++) {
      sum += parseInt(this._value.substring(i - 1, i), 10) * (factor - i);
    }
    let remainder = (sum * 10) % 11;
    return remainder === 10 || remainder === 11 ? 0 : remainder;
  };

  private sanitizeInput(input: string, chars: string) {
    if (!input) throw new ValidationError("CPF is required");
    return input.replace(new RegExp(`[${chars}]`, "g"), "");
  }
}
