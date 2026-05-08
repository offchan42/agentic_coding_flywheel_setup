import { describe, expect, test } from "bun:test";
import {
  PROVIDER_PACKET_BASE_VERIFICATION_COMMANDS,
  PROVIDER_PACKET_EXPECTED_ARTIFACTS,
  PROVIDER_PACKET_FORBIDDEN_FIELD_NAMES,
  PROVIDER_PACKET_REDACTED_FIELD_PATHS,
  PROVIDER_PACKET_REQUIRED_FIELD_PATHS,
  PROVIDER_PACKET_SUPPORT_BUNDLE_SAFE_PATHS,
  PROVIDER_PROVISIONING_PACKET_SCHEMA,
  PROVIDER_PROVISIONING_PACKET_SCHEMA_VERSION,
  manualStepsForProvider,
} from "./providerProvisioningPacket";
import { VPS_PROVIDERS } from "./vpsProviders";

describe("provider provisioning packet contract", () => {
  test("pins a stable v1 schema id", () => {
    expect(PROVIDER_PROVISIONING_PACKET_SCHEMA).toBe("acfs.provider-provisioning-packet.v1");
    expect(PROVIDER_PROVISIONING_PACKET_SCHEMA_VERSION).toBe(1);
  });

  test("requires the fields needed by provider automation and support handoff", () => {
    expect(PROVIDER_PACKET_REQUIRED_FIELD_PATHS).toEqual(
      expect.arrayContaining([
        "provider.id",
        "region.id",
        "size.planName",
        "size.ramGB",
        "size.vCPU",
        "size.storageGB",
        "osImage.version",
        "access.username",
        "access.sshPublicKeyLabel",
        "cloudInit.mode",
        "install.command",
        "compatibility.requiredSpecs",
        "compatibility.readinessStatus",
        "verificationCommands",
        "expectedArtifacts",
      ]),
    );
  });

  test("keeps support-bundle projection away from raw host and credential fields", () => {
    const safePathText = PROVIDER_PACKET_SUPPORT_BUNDLE_SAFE_PATHS.join("\n").toLowerCase();

    expect(safePathText).not.toContain("targethost.address");
    expect(safePathText).not.toContain("privatekey");
    expect(safePathText).not.toContain("token");
    expect(safePathText).not.toContain("password");
    expect(safePathText).not.toContain("rawuserdata");
    expect(PROVIDER_PACKET_FORBIDDEN_FIELD_NAMES).toEqual(
      expect.arrayContaining(["provider_api_key", "sshPrivateKey", "token", "password", "ip", "hostname"]),
    );
    expect(PROVIDER_PACKET_REDACTED_FIELD_PATHS).toEqual(
      expect.arrayContaining([
        "targetHost.address",
        "cloudInit.rawUserData",
        "access.sshPrivateKey",
        "install.environment",
      ]),
    );
  });

  test("defines support-safe verification commands and expected artifact metadata", () => {
    const commandIds = PROVIDER_PACKET_BASE_VERIFICATION_COMMANDS.map((command) => command.id);
    const supportSafeCommandIds = PROVIDER_PACKET_BASE_VERIFICATION_COMMANDS
      .filter((command) => command.supportBundleSafe)
      .map((command) => command.id);
    const artifactIds = PROVIDER_PACKET_EXPECTED_ARTIFACTS.map((artifact) => artifact.id);

    expect(commandIds).toEqual(["ssh-root", "installer", "doctor", "support-bundle"]);
    expect(supportSafeCommandIds).toEqual(["installer", "doctor", "support-bundle"]);
    expect(artifactIds).toEqual([
      "provider-order-confirmation",
      "installer-log",
      "support-report",
      "support-manifest",
    ]);
    expect(PROVIDER_PACKET_EXPECTED_ARTIFACTS.every((artifact) => artifact.redactionRequired)).toBe(true);
  });

  test("documents manual remaining steps for every current wizard provider", () => {
    for (const provider of VPS_PROVIDERS) {
      const steps = manualStepsForProvider(provider.id);

      expect(steps.length).toBeGreaterThanOrEqual(4);
      expect(steps.join("\n").toLowerCase()).toContain("manually");
    }
  });

  test("falls back to generic manual steps for unknown providers", () => {
    const steps = manualStepsForProvider("not-listed");

    expect(steps.join("\n")).toContain("Verify the provider offers SSH access");
    expect(steps.join("\n").toLowerCase()).toContain("manually");
  });
});
