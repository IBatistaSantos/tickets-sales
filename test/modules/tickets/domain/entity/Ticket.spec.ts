import { describe, expect, it } from "bun:test";
import {
  Ticket,
  TicketSaleStatus,
} from "@modules/tickets/domain/entity/Ticket";

describe("Ticket", () => {
  it("should create a ticket", () => {
    // Arrange
    const ticketProps = {
      name: "Ticket 1",
      ownerId: "ownerId",
      price: {
        value: 100,
        currency: "BRL",
      },
    };

    const ticket = new Ticket({
      name: ticketProps.name,
      ownerId: ticketProps.ownerId,
      price: {
        price: ticketProps.price.value,
      },
      stock: {
        type: "UNLIMITED",
      },
    });

    expect(ticket).toBeDefined();
    expect(ticket.name).toBe("Ticket 1");
    expect(ticket.ownerId).toBe("ownerId");
    expect(ticket.price.price).toBe(100);
    expect(ticket.price.currency).toBe("BRL");
  });

  it("should throw an error if price is not provided", () => {
    const ticketProps = {
      name: "Ticket 1",
      ownerId: "ownerId",
    };

    const createTicket = () =>
      new Ticket({
        name: ticketProps.name,
        ownerId: ticketProps.ownerId,
        price: "" as any,
        stock: {
          type: "UNLIMITED",
        },
      });

    expect(createTicket).toThrowError("Price is required");
  });

  it("should throw an error if name not provided", () => {
    const ticketProps = {
      ownerId: "ownerId",
      price: {
        value: 100,
        currency: "BRL",
      },
    };

    const createTicket = () =>
      new Ticket({
        name: "",
        ownerId: ticketProps.ownerId,
        price: {
          price: ticketProps.price.value,
        },
        stock: {
          type: "UNLIMITED",
        },
      });

    expect(createTicket).toThrowError("Name is required");
  });

  it("should throw an error if ownerId not provided", () => {
    const ticketProps = {
      name: "Ticket 1",
      price: {
        value: 100,
        currency: "BRL",
      },
    };

    const createTicket = () =>
      new Ticket({
        name: ticketProps.name,
        ownerId: "",
        price: {
          price: ticketProps.price.value,
        },
        stock: {
          type: "UNLIMITED",
        },
      });

    expect(createTicket).toThrowError("OwnerId is required");
  });

  it("should throw an error if accessType unavailable", () => {
    const ticketProps = {
      name: "Ticket 1",
      ownerId: "ownerId",
      price: {
        value: 100,
        currency: "BRL",
      },
    };

    const createTicket = () =>
      new Ticket({
        name: ticketProps.name,
        ownerId: ticketProps.ownerId,
        price: {
          price: ticketProps.price.value,
        },
        accessType: "INVALID",
        stock: {
          type: "UNLIMITED",
        },
      });

    expect(createTicket).toThrowError("Invalid access type");
  });

  it("should activate ticket", () => {
    const ticket = new Ticket({
      name: "Ticket 1",
      ownerId: "ownerId",
      price: {
        price: 100,
      },
      stock: {
        type: "UNLIMITED",
      },
    });

    ticket.activate();

    expect(ticket.saleStatus).toBe(TicketSaleStatus.AVAILABLE);
  });

  it("should pause ticket", () => {
    const ticket = new Ticket({
      name: "Ticket 1",
      ownerId: "ownerId",
      price: {
        price: 100,
      },
      stock: {
        type: "UNLIMITED",
      },
    });

    ticket.pause();

    expect(ticket.saleStatus).toBe(TicketSaleStatus.PAUSED);
  });

  it("should throw an error if saleStatus unavailable", () => {
    const ticketProps = {
      name: "Ticket 1",
      ownerId: "ownerId",
      price: {
        value: 100,
        currency: "BRL",
      },
    };

    const createTicket = () =>
      new Ticket({
        name: ticketProps.name,
        ownerId: ticketProps.ownerId,
        price: {
          price: ticketProps.price.value,
        },
        saleStatus: "INVALID" as any,
        stock: {
          type: "UNLIMITED",
        },
      });

    expect(createTicket).toThrowError("Invalid sale status");
  });
});
