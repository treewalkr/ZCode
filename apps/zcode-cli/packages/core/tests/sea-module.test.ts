import { afterEach, describe, expect, it } from "vitest";

import { getRuntimeInfo } from "../src/environment.js";
import { getSeaModule } from "../src/sea.js";

const realGetBuiltinModule = process.getBuiltinModule;

const withoutGetBuiltinModule = (): void => {
  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });
};

const withSeaModule = (module: { isSea: () => boolean }): void => {
  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: (id: string) =>
      id === "node:sea" ? module : realGetBuiltinModule?.(id),
  });
};

afterEach(() => {
  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: realGetBuiltinModule,
  });
});

describe("getSeaModule", () => {
  it("returns the node:sea module on runtimes that provide it", () => {
    const module = getSeaModule();

    expect(module).toBeDefined();
    expect(module?.isSea()).toBe(false);
  });

  it("returns undefined when the runtime lacks node:sea (e.g. Bun)", () => {
    withoutGetBuiltinModule();

    expect(getSeaModule()).toBeUndefined();
  });
});

describe("getRuntimeInfo sea detection", () => {
  it("reports false outside single-executable builds", () => {
    expect(getRuntimeInfo().sea).toBe(false);
  });

  it("does not crash when the runtime lacks node:sea", () => {
    withoutGetBuiltinModule();

    expect(getRuntimeInfo().sea).toBe(false);
  });

  it("reports true inside single-executable builds", () => {
    withSeaModule({ isSea: () => true });

    expect(getRuntimeInfo().sea).toBe(true);
  });
});
