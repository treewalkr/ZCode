type SeaModule = typeof import("node:sea");

/**
 * node:sea is a Node builtin that some runtimes do not implement — Bun
 * crashes on a bare import of it. Resolve it through process.getBuiltinModule,
 * which returns undefined for unavailable builtins, and let callers treat
 * that as "not running from a single-executable build".
 */
export const getSeaModule = (): SeaModule | undefined => {
  const getBuiltinModule = process.getBuiltinModule as
    | ((id: "node:sea") => SeaModule)
    | undefined;
  return getBuiltinModule?.("node:sea");
};
