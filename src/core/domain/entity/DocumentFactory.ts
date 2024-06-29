import { ValidationError } from "../errors/ValidationError";
import { CNPJ } from "./CNPJ";
import { CPF } from "./CPF";

enum DocumentType {
  CPF = "CPF",
  CNPJ = "CNPJ",
  PASSPORT = "PASSPORT",
}

export class DocumentFactory {
  static create(documentType: string, document: string) {
    if (!document) {
      throw new ValidationError("Document is required");
    }

    switch (documentType) {
      case DocumentType.CPF:
        return new CPF(this.sanitizeInput(document, ".-"));
      case DocumentType.CNPJ:
        return new CNPJ(this.sanitizeInput(document, "./-"));
      default:
        throw new Error("Invalid document type");
    }
  }

  private static sanitizeInput(input: string, charsToRemove: string) {
    if (!input) throw new ValidationError("CNPJ is required");
    const regex = new RegExp(`[${charsToRemove}]`, "g");
    return input.replace(regex, "");
  }
}
