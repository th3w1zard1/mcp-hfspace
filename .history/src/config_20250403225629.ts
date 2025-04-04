import { argv } from 'process';
import minimist, { ParsedArgs } from "minimist";
import path from "path";

export interface Config {
  claudeDesktopMode: boolean;
  workDir: string;
  spacePaths: string[];
  hfToken?: string;
  debug: boolean;
}

export const config = parseConfig();

export function parseConfig(spacePathsArg?: string[]): Config {
  const argv: ParsedArgs = minimist(process.argv.slice(2), {
    string: ["work-dir", "hf-token"],
    boolean: ["desktop-mode", "debug"],
    default: {
      "desktop-mode": process.env.CLAUDE_DESKTOP_MODE !== "false",
      "work-dir": process.env.MCP_HF_WORK_DIR || process.cwd(),
      "hf-token": process.env.HF_TOKEN,
      debug: false,
    },
    "--": true,
  });

  const spacePaths: string[] = spacePathsArg && spacePathsArg.length > 0 ? spacePathsArg : argv._.filter((arg: string) => arg.toString().trim().length > 0);

  return {
    claudeDesktopMode: argv["desktop-mode"],
    workDir: path.resolve(argv["work-dir"]),
    hfToken: argv["hf-token"],
    debug: argv["debug"],
    spacePaths: spacePaths.length > 0 ? spacePaths : ["evalstate/FLUX.1-schnell"],
  };
}
