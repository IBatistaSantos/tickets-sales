import { describe, expect, it } from "bun:test";
import { Currency, TicketPrice } from "../../../../../src/modules/tickets/domain/valueObject/TicketPrice";



describe("TicketPrice", () => {
  it("should create a ticket price", () => {
    
    const ticketPriceProps = {
      price: 100,
      currency: Currency.BRL,
    };

    
    const ticketPrice = new TicketPrice({
      price: ticketPriceProps.price,
      currency: ticketPriceProps.currency,
    });

    
    expect(ticketPrice).toBeDefined();
    expect(ticketPrice.price).toBe(100);
    expect(ticketPrice.currency).toBe("BRL");
  });

  it("should create a ticket price with default currency", () => {
    
    const ticketPriceProps = {
      price: 100,
    };

    
    const ticketPrice = new TicketPrice({
      price: ticketPriceProps.price,
    });

    
    expect(ticketPrice).toBeDefined();
    expect(ticketPrice.price).toBe(100);
    expect(ticketPrice.currency).toBe("BRL");
  });

  it("should throw an error if price is not provided", () => {
    const ticketPriceProps = {
      currency: "BRL",
    };

    
    const createTicketPrice = () =>
      new TicketPrice({
        price: "" as any,
        currency: ticketPriceProps.currency as any,
      });

    
    expect(createTicketPrice).toThrowError("Price is required");
  });

  it("should throw an error if currency is not provided", () => {
    const ticketPriceProps = {
      price: 100,
    };

    
    const createTicketPrice = () =>
      new TicketPrice({
        price: ticketPriceProps.price,
        currency: "AAA" as any,
      });

    
    expect(createTicketPrice).toThrowError("Invalid currency");
  });

  it("should throw an error if price is less than 0", () => {
    
    const ticketPriceProps = {
      price: -1,
      currency: "BRL",
    };

    
    const createTicketPrice = () =>
      new TicketPrice({
        price: ticketPriceProps.price,
        currency: Currency.BRL,
      });

    
    expect(createTicketPrice).toThrowError("Price must be greater than 0");
  });
})