import { describe, expect, it } from "bun:test";
import { TicketStock } from "../../../../../src/modules/tickets/domain/valueObject/TicketStock";

describe("TicketStock", () => {
  it("should create a ticket stock", () => {
    const ticketStockProps = {
      type: "LIMITED",
      total: 100,
    };

    const ticketStock = new TicketStock({
      type: "LIMITED",
      total: ticketStockProps.total,
    });

    expect(ticketStock).toBeDefined();
    expect(ticketStock.total).toBe(100);
    expect(ticketStock.available).toBe(100);
    expect(ticketStock.type).toBe("LIMITED");
  });

  it("should throw an error if type is not provided", () => {
    const ticketStockProps = {
      total: 100,
    };

    expect(
      () =>
        new TicketStock({
          type: "" as any,
          total: ticketStockProps.total,
        })
    ).toThrowError("Invalid type");
  });

  it("should throw an error if type is invalid", () => {
    expect(
      () =>
        new TicketStock({
          type: "INVALID" as any,
          total: 100,
        })
    ).toThrowError("Invalid type");
  });

  it("should throw an error if total is less than 0", () => {
    expect(
      () =>
        new TicketStock({
          type: "LIMITED",
          total: -1,
        })
    ).toThrowError("Total must be greater than 0");
  });

  it("should throw an error if available is less than 0", () => {
    expect(
      () =>
        new TicketStock({
          type: "LIMITED",
          total: 100,
          available: -1,
        })
    ).toThrowError("Available must be greater than 0");
  });

  it("should throw an error if available is greater than total", () => {
    expect(
      () =>
        new TicketStock({
          type: "LIMITED",
          total: 100,
          available: 101,
        })
    ).toThrowError("Available must be less than total");
  });

  describe("update", () => {
    it("should update the total and available", () => {
      const ticketStock = new TicketStock({
        type: "LIMITED",
        total: 100,
      });

      ticketStock.update({ total: 200 }, 0);

      expect(ticketStock.total).toBe(200);
      expect(ticketStock.available).toBe(200);
    });

    it("should update the available for zero", () => {
      const ticketStock = new TicketStock({
        type: "LIMITED",
        total: 100,
      });

      ticketStock.update({ total: 100 }, 100);

      expect(ticketStock.total).toBe(100);
      expect(ticketStock.available).toBe(0);
    })

    it("should update the total and available when type is UNLIMITED", () => {
      const ticketStock = new TicketStock({
        type: "LIMITED",
        total: 100,
      });

      ticketStock.update({ type: "UNLIMITED" }, 0);

      expect(ticketStock.total).toBe(0);
      expect(ticketStock.available).toBe(0);
    });

    it("should throw an error if total is less than quantity sold", () => {
      const ticketStock = new TicketStock({
        type: "LIMITED",
        total: 100,
      });

      expect(() => ticketStock.update({ total: 99 }, 101)).toThrowError(
        "Total must be greater than quantity sold"
      );
    });


  })
});
