import { describe, it, expect, beforeEach } from "bun:test";
import { MockController } from "./mocks/MockController";

describe("BaseController", () => {
  let controller: MockController;

  beforeEach(() => {
    controller = new MockController();
  });

  it("should return 500 and error message on exception", async () => {
    const req = { body: { fail: true } };

    const response = await controller.handle(req);

    expect(response.statusCode).toBe(500);
    expect(response.data).toEqual({ message: "Internal server error" });
  });

  it("should return 200 and success message", async () => {
    const req = { body: { fail: false, name: "test" } };

    const response = await controller.handle(req);

    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ message: "Success" });
  });

  it("should return 400 and error message on BaseError", async () => {
    const req = { body: { mockError: true } };

    const response = await controller.handle(req);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual({ message: "Mock error" });
  });

  it("should return 400 and error message on validation error", async () => {
    const req = { body: { fail: false } };

    const response = await controller.handle(req);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual({ message: "Name is required" });
  });
});
