import {
  BaseEntity,
  BaseEntityProps,
} from "../../../../core/domain/entity/BaseEntity";
import { ValidationError } from "../../../../core/domain/errors/ValidationError";

interface OwnerProps extends BaseEntityProps {
  name: string;
  organizerId: string;
}

export class Owner extends BaseEntity {
  private _name: string;
  private _organizerId: string;

  constructor(props: OwnerProps) {
    super(props);
    this._name = props.name;
    this._organizerId = props.organizerId;

    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get organizerId(): string {
    return this._organizerId;
  }


  update(props: Partial<OwnerProps>) {
    this._name = props.name || this._name;
    this.validate();
  }

  private validate() {
    if (!this._name) {
      throw new ValidationError("Name is required");
    }

    if (!this._organizerId) {
      throw new ValidationError("OrganizerId is required");
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      organizerId: this.organizerId,
    };
  }
}
