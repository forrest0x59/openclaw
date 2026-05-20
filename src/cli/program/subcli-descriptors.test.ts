import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import {
  getSubCliEntries,
  getSubCliCommandsWithSubcommands,
  getSubCliParentDefaultHelpCommands,
  SUB_CLI_DESCRIPTORS,
} from "./subcli-descriptors";

describe("subcli-descriptors", () => {
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI;
    } else {
      process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI = originalEnv;
    }
  });

  describe("when private QA CLI is disabled", () => {
    beforeEach(() => {
      process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI = "0";
    });

    it("getSubCliEntries should exclude qa descriptor", () => {
      const entries = getSubCliEntries();
      const expectedEntries = SUB_CLI_DESCRIPTORS.filter((d) => d.name !== "qa");

      expect(entries.find((d) => d.name === "qa")).toBeUndefined();
      expect(entries).toEqual(expectedEntries);
    });

    it("getSubCliCommandsWithSubcommands should exclude qa", () => {
      const commands = getSubCliCommandsWithSubcommands();
      const expectedCommands = SUB_CLI_DESCRIPTORS.filter(
        (d) => d.name !== "qa" && d.hasSubcommands,
      ).map((d) => d.name);

      expect(commands.includes("qa")).toBe(false);
      expect([...commands].sort()).toEqual([...expectedCommands].sort());
    });

    it("getSubCliParentDefaultHelpCommands should exclude qa", () => {
      const commands = getSubCliParentDefaultHelpCommands();
      const expectedCommands = SUB_CLI_DESCRIPTORS.filter(
        (d) => d.name !== "qa" && d.parentDefaultHelp,
      ).map((d) => d.name);

      expect(commands.includes("qa")).toBe(false);
      expect([...commands].sort()).toEqual([...expectedCommands].sort());
    });

    it("all three functions should agree on qa being absent", () => {
      const entries = getSubCliEntries();
      const commands = getSubCliCommandsWithSubcommands();
      const parentHelp = getSubCliParentDefaultHelpCommands();

      expect(entries.find((d) => d.name === "qa")).toBeUndefined();
      expect(commands.includes("qa")).toBe(false);
      expect(parentHelp.includes("qa")).toBe(false);
    });
  });

  describe("when private QA CLI is enabled", () => {
    beforeEach(() => {
      process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI = "1";
    });

    it("getSubCliEntries should include qa descriptor", () => {
      const entries = getSubCliEntries();
      const expectedEntries = SUB_CLI_DESCRIPTORS;

      expect(entries.find((d) => d.name === "qa")).toBeDefined();
      expect(entries).toEqual(expectedEntries);
    });

    it("getSubCliCommandsWithSubcommands should include qa", () => {
      const commands = getSubCliCommandsWithSubcommands();
      const expectedCommands = SUB_CLI_DESCRIPTORS.filter((d) => d.hasSubcommands).map(
        (d) => d.name,
      );

      expect(commands.includes("qa")).toBe(true);
      expect([...commands].sort()).toEqual([...expectedCommands].sort());
    });

    it("getSubCliParentDefaultHelpCommands should exclude qa", () => {
      const commands = getSubCliParentDefaultHelpCommands();
      const expectedCommands = SUB_CLI_DESCRIPTORS.filter((d) => d.parentDefaultHelp).map(
        (d) => d.name,
      );

      expect(commands.includes("qa")).toBe(false);
      expect([...commands].sort()).toEqual([...expectedCommands].sort());
    });
  });
});
