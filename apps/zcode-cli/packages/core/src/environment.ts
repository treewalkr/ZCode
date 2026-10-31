import type { RuntimeInfo } from "@zcode/shared-types";

import { getSeaModule } from "./sea.js";

export { type RuntimeInfo };

export const getRuntimeInfo = (): RuntimeInfo => ({
  arch: process.arch,
  cwd: process.cwd(),
  execPath: process.execPath,
  node: process.version,
  platform: process.platform,
  sea: getSeaModule()?.isSea() === true,
  versions: process.versions,
});
