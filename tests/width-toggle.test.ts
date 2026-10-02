import { describe, expect, it } from "vitest";
import { applyFullWidth, DEFAULT_STATE, FULL_WIDTH_CLASS, parseState } from "../src/width-toggle";

describe("parseState", () => {
  it("returns the persisted flag when valid", () => {
    expect(parseState({ fullWidth: true })).toEqual({ fullWidth: true });
    expect(parseState({ fullWidth: false })).toEqual({ fullWidth: false });
  });

  it.each([null, undefined, 42, "x", {}, { fullWidth: "yes" }, { fullWidth: 1 }])(
    "falls back to defaults for %j",
    (raw) => {
      expect(parseState(raw)).toBe(DEFAULT_STATE);
    },
  );
});

describe("applyFullWidth", () => {
  function fakeBody(): HTMLElement {
    const classes = new Set<string>();
    const classList = {
      toggle: (name: string, force: boolean) => (force ? classes.add(name) : classes.delete(name)),
      contains: (name: string) => classes.has(name),
    };
    return { classList } as unknown as HTMLElement;
  }

  it("adds and removes the full-width class", () => {
    const body = fakeBody();
    applyFullWidth(body, true);
    expect(body.classList.contains(FULL_WIDTH_CLASS)).toBe(true);
    applyFullWidth(body, false);
    expect(body.classList.contains(FULL_WIDTH_CLASS)).toBe(false);
  });
});
