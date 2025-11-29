import { describe, it, expect } from "vitest";
import { when } from "../store";

describe("when.params", () => {
  it("matches when all specified key/value pairs exist", () => {
    const matcher = when.params<{ id: string; page: string }>({
      id: "42",
    });

    expect(matcher({ id: "42", page: "1" })).toBe(true);
  });

  it("fails when a value does not match", () => {
    const matcher = when.params<{ id: string }>({
      id: "42",
    });

    expect(matcher({ id: "10" })).toBe(false);
  });

  it("fails when a required key is missing", () => {
    const matcher = when.params<{ id?: string }>({ id: "42" });

    expect(matcher({})).toBe(false);
  });

  it("supports matching multiple keys", () => {
    const matcher = when.params<{ id: string; status: string }>({
      id: "42",
      status: "active",
    });

    expect(matcher({ id: "42", status: "active" })).toBe(true);

    expect(matcher({ id: "42", status: "inactive" })).toBe(false);
  });
});

describe("when.empty", () => {
  it("matches an empty object", () => {
    expect(when.empty({})).toBe(true);
  });

  it("matches an object where every value is empty string", () => {
    expect(when.empty({ q: "" })).toBe(true);
  });

  it("matches an object where every value is undefined", () => {
    expect(when.empty({ q: undefined, page: undefined })).toBe(true);
  });

  it("fails when at least one value contains meaningful data", () => {
    expect(when.empty({ q: "", page: "1" })).toBe(false);
  });

  it("fails when any value is not empty or undefined", () => {
    expect(when.empty({ q: "something" })).toBe(false);
  });
});
