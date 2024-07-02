import {
  BaseEntity,
  BaseEntityProps,
} from "../../../../core/domain/entity/BaseEntity";
import { ValidationError } from "../../../../core/domain/errors/ValidationError";
import { TicketPrice, TicketPriceProps } from "../valueObject/TicketPrice";
import { TicketStock, TicketStockProps } from "../valueObject/TicketStock";

export enum TicketSaleStatus {
  AVAILABLE = "AVAILABLE",
  SOLD_OUT = "SOLD_OUT",
  PAUSED = "PAUSED",
}

interface TicketProps extends BaseEntityProps {
  name: string;
  description?: string;
  ownerId: string;
  price: TicketPriceProps;
  stock: TicketStockProps;
  saleStatus?: TicketSaleStatus;
  accessType?: string;
  usedQuantity?: number;
  position?: number;
  hidden?: boolean;
  categoryId?: string;
}

export class Ticket extends BaseEntity {
  private _name: string;
  private _description: string;
  private _ownerId: string;
  private _price: TicketPrice;
  private _stock: TicketStock;
  private _saleStatus: TicketSaleStatus;
  private _usedQuantity: number;
  private _position: number;
  private _hidden: boolean;
  private _categoryId: string;
  private _accessType: string;

  constructor(props: TicketProps) {
    super(props);
    this._name = props.name;
    this._description = props.description || "";
    this._ownerId = props.ownerId;
    this._price = new TicketPrice(props.price);
    this._stock = new TicketStock(props.stock);
    this._accessType = props.accessType || "DIGITAL";
    this._saleStatus = props.saleStatus || TicketSaleStatus.AVAILABLE;
    this._usedQuantity = props.usedQuantity || 0;
    this._position = props.position || 0;
    this._hidden = props.hidden || false;
    this._categoryId = props.categoryId || "";

    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get accessType(): string {
    return this._accessType;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get price(): TicketPrice {
    return this._price;
  }

  get stock(): TicketStock {
    return this._stock;
  }

  get saleStatus(): TicketSaleStatus {
    return this._saleStatus;
  }

  get usedQuantity(): number {
    return this._usedQuantity;
  }

  get position(): number {
    return this._position;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  get categoryId(): string | undefined {
    return this._categoryId;
  }

  hide() {
    this._hidden = true;
  }

  show() {
    this._hidden = false;
  }

  update(props: Partial<TicketProps>) {
    this._name = props.name || this._name;
    this._description = props.description || this._description;

    if (props.price) {
      this._price.update(props.price);
    }

    if (props.stock) {
      this._stock.update(props.stock, this._usedQuantity);
    }

    this.validate();
  }

  updatePosition(position: number) {
    this._position = position;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      accessType: this.accessType,
      price: this.price.toJSON(),
      stock: this.stock.toJSON(),
      saleStatus: this.saleStatus,
      usedQuantity: this.usedQuantity,
      position: this.position,
      hidden: this.hidden,
      categoryId: this.categoryId,
    };
  }

  public activate(): void {
    this._saleStatus = TicketSaleStatus.AVAILABLE;
  }

  public pause(): void {
    this._saleStatus = TicketSaleStatus.PAUSED;
  }

  decreaseStock(quantity: number): void {
    this._stock.decreaseStock(quantity);
    this._usedQuantity += quantity;
  }

  canSales(quantity: number) {
    if (this._saleStatus !== TicketSaleStatus.AVAILABLE) {
      return {
        succeeded: false,
        reason: `Ticket with name ${this._name} is not available`,
      };
    }

    const validateStock = this._stock.validateStock(quantity);

    if (!validateStock) {
      return {
        succeeded: false,
        reason: `Ticket with name ${this._name} has no stock`,
      };
    }

    return {
      succeeded: true,
      reason: null,
    };
  }

  private validate() {
    const saleStatusValues = [
      TicketSaleStatus.AVAILABLE,
      TicketSaleStatus.SOLD_OUT,
      TicketSaleStatus.PAUSED,
    ];
    if (!saleStatusValues.includes(this._saleStatus)) {
      throw new ValidationError("Invalid sale status");
    }

    const accessTypeValues = ["DIGITAL", "PRESENCIAL", "HYBRID"];
    if (!accessTypeValues.includes(this._accessType)) {
      throw new ValidationError("Invalid access type");
    }

    if (!this._name) {
      throw new ValidationError("Name is required");
    }

    if (!this._ownerId) {
      throw new ValidationError("OwnerId is required");
    }

    if (!this._accessType) {
      throw new ValidationError("AccessType is required");
    }

    if (!this._saleStatus) {
      throw new ValidationError("SaleStatus is required");
    }

    if (this._usedQuantity < 0) {
      throw new ValidationError("UsedQuantity must be greater than 0");
    }

    if (this._position < 0) {
      throw new ValidationError("Position must be greater than 0");
    }
  }
}
