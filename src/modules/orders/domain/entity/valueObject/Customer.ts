import { DocumentFactory } from "@core/domain/entity/DocumentFactory";
import { Email } from "@core/domain/entity/Email";
import { ValidationError } from "@core/domain/errors/ValidationError";

export interface OrderCustomerProps {
  name: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
}

export class OrderCustomer {
  private _name: string;
  private _email: string;
  private _document: string;
  private _documentType: string;
  private _phone: string;

  constructor(props: OrderCustomerProps) {
    const documentType = props.documentType.toUpperCase();
    this._name = props.name;
    this._email = new Email(props.email).value;
    this._document = DocumentFactory.create(documentType, props.document).value;
    this._documentType = documentType;
    this._phone = props.phone;

    this.validate();
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  toJSON() {
    return {
      name: this._name,
      email: this._email,
      document: this._document,
      documentType: this._documentType,
      phone: this._phone,
    };
  }

  private validate() {
    if (!this._name) {
      throw new ValidationError("Name is required");
    }

    if (!this._email) {
      throw new ValidationError("Email is required");
    }

    if (!this._document) {
      throw new ValidationError("Document is required");
    }

    const documentTypes = ["CPF", "CNPJ", "PASSPORT"];

    if (!this._documentType) {
      throw new ValidationError("Document type is required");
    }

    if (!documentTypes.includes(this._documentType)) {
      throw new ValidationError("Document type is invalid");
    }

    if (!this._phone) {
      throw new ValidationError("Phone is required");
    }
  }
}
