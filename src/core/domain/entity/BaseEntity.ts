import { randomUUID } from "crypto";
import { Status } from "../value-object/Status";

interface BaseEntityParams {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
}

export type BaseEntityProps = Partial<BaseEntityParams>;


export class BaseEntity {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: Status 

  constructor (props: BaseEntityProps) {
    this._id = props.id || randomUUID();
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._status = props.status || Status.ACTIVE;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): Status {
    return this._status;
  }

  public activate(): void {
    this._status = Status.ACTIVE;
  }

  public deactivate(): void {
    this._status = Status.INACTIVE;
  }


  toJSON(): BaseEntityProps {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status
    }
  }
}