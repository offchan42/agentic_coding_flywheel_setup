import type { ModuleSelectionInput } from "./moduleSelection";
import type { InstallMode } from "./userPreferences";
import type {
  PlanStatus,
  RequiredSpecs,
  VPSPlan,
  VPSReadinessCheck,
  VPSReadinessStatus,
  WorkloadId,
} from "./vpsProviders";

export const PROVIDER_PROVISIONING_PACKET_SCHEMA = "acfs.provider-provisioning-packet.v1";
export const PROVIDER_PROVISIONING_PACKET_SCHEMA_VERSION = 1;

export type ProviderProvisioningPacketStage =
  | "draft"
  | "ready_for_manual_provider_checkout"
  | "ready_for_api_provisioning"
  | "provider_server_created"
  | "installer_ready"
  | "verified"
  | "blocked";

export type ProviderProvisioningPacketActor =
  | "acfs-web-wizard"
  | "acfs-installer"
  | "provider-adapter"
  | "operator";

export interface ProviderProvisioningPacketPrivacy {
  supportBundleSafe: true;
  rawProviderCredentialsIncluded: false;
  rawTargetHostIncluded: false;
  rawPrivateKeyIncluded: false;
  rawPrivateKeyPathIncluded: false;
  rawCloudInitIncludedInSupportBundle: false;
  exactInstallCommandIncluded: true;
  targetUsernameMayAppear: true;
  publicSshKeyMaterialMayAppear: true;
  redactedFieldPaths: string[];
  forbiddenFieldNames: string[];
}

export interface ProviderProvisioningPacketProvenance {
  generatedBy: ProviderProvisioningPacketActor;
  generatedAt: string;
  sourceRef: string;
  wizardStep: "rent-vps" | "run-installer" | "provider-adapter";
  readinessSource: "validateVPSReadiness";
  capacitySource: "calculateRequiredSpecs/evaluatePlan";
  pricingLastUpdated: string;
}

export interface ProviderProvisioningPacketProvider {
  id: string;
  name: string;
  productUrl: string;
  automationLevel: "manual" | "cloud_init_only" | "api_supported";
  manualCheckoutRequired: boolean;
  manualStepsRemaining: string[];
}

export interface ProviderProvisioningPacketRegion {
  id: string;
  label: string;
  readinessStatus: Extract<VPSReadinessStatus, "supported" | "borderline" | "unknown">;
  providerSpecificCode?: string;
}

export interface ProviderProvisioningPacketSize {
  planName: string;
  ramGB: number;
  vCPU: number;
  storageGB: number;
  priceUSD?: number;
  sourcePlan: VPSPlan | null;
}

export interface ProviderProvisioningPacketOsImage {
  distribution: "ubuntu";
  version: string;
  minimumVersion: string;
  preferredVersions: string[];
  readinessStatus: VPSReadinessStatus;
  providerImageId?: string;
}

export interface ProviderProvisioningPacketAccess {
  username: string;
  rootLoginExpected: boolean;
  sshPublicKeyLabel: string;
  sshPublicKeyFingerprint?: string;
  sshPublicKeyMaterial?: string;
  sshPrivateKeyIncluded: false;
  sshPrivateKeyPathIncluded: false;
}

export interface ProviderProvisioningPacketCloudInit {
  mode: "none" | "manual_paste" | "provider_user_data" | "api_user_data";
  userDataIncluded: boolean;
  userDataSha256?: string;
  templateRef?: string;
  redactedPreview?: string;
  notes: string[];
}

export interface ProviderProvisioningPacketInstall {
  mode: InstallMode;
  sourceRef: string;
  command: string;
  commandRunLocation: "vps-root-shell" | "cloud-init" | "provider-api";
  moduleSelection?: ModuleSelectionInput;
}

export interface ProviderProvisioningPacketVerificationCommand {
  id: string;
  label: string;
  command: string;
  runLocation: "local" | "vps";
  expectedStatus: "pass" | "warn" | "fail";
  supportBundleSafe: boolean;
}

export interface ProviderProvisioningPacketExpectedArtifact {
  id: string;
  pathPattern: string;
  producedBy: "provider" | "installer" | "operator";
  supportBundleSafe: boolean;
  redactionRequired: boolean;
}

export interface ProviderProvisioningPacketCompatibility {
  workloadId: WorkloadId;
  targetAgents: number;
  requiredSpecs: RequiredSpecs;
  selectedPlanStatus: PlanStatus | "unknown";
  selectedPlanSafeAgents: number | null;
  selectedPlanRecommendedAgents: number | null;
  readinessStatus: VPSReadinessStatus;
  readinessChecks: VPSReadinessCheck[];
}

export interface ProviderProvisioningPacket {
  schema: typeof PROVIDER_PROVISIONING_PACKET_SCHEMA;
  schemaVersion: typeof PROVIDER_PROVISIONING_PACKET_SCHEMA_VERSION;
  stage: ProviderProvisioningPacketStage;
  privacy: ProviderProvisioningPacketPrivacy;
  provenance: ProviderProvisioningPacketProvenance;
  provider: ProviderProvisioningPacketProvider;
  region: ProviderProvisioningPacketRegion;
  size: ProviderProvisioningPacketSize;
  osImage: ProviderProvisioningPacketOsImage;
  access: ProviderProvisioningPacketAccess;
  cloudInit: ProviderProvisioningPacketCloudInit;
  install: ProviderProvisioningPacketInstall;
  compatibility: ProviderProvisioningPacketCompatibility;
  verificationCommands: ProviderProvisioningPacketVerificationCommand[];
  expectedArtifacts: ProviderProvisioningPacketExpectedArtifact[];
}

export const PROVIDER_PACKET_REQUIRED_FIELD_PATHS = [
  "schema",
  "schemaVersion",
  "stage",
  "privacy.redactedFieldPaths",
  "privacy.forbiddenFieldNames",
  "provenance.generatedBy",
  "provenance.generatedAt",
  "provenance.sourceRef",
  "provider.id",
  "provider.name",
  "provider.automationLevel",
  "provider.manualStepsRemaining",
  "region.id",
  "region.readinessStatus",
  "size.planName",
  "size.ramGB",
  "size.vCPU",
  "size.storageGB",
  "osImage.distribution",
  "osImage.version",
  "access.username",
  "access.sshPublicKeyLabel",
  "access.sshPrivateKeyIncluded",
  "access.sshPrivateKeyPathIncluded",
  "cloudInit.mode",
  "cloudInit.userDataIncluded",
  "install.mode",
  "install.sourceRef",
  "install.command",
  "compatibility.workloadId",
  "compatibility.targetAgents",
  "compatibility.requiredSpecs",
  "compatibility.readinessStatus",
  "verificationCommands",
  "expectedArtifacts",
] as const;

export const PROVIDER_PACKET_FORBIDDEN_FIELD_NAMES = [
  "api_key",
  "apiToken",
  "authorization",
  "credential",
  "dashboardCookie",
  "home",
  "hostname",
  "ip",
  "password",
  "privateKey",
  "private_key",
  "provider_api_key",
  "secret",
  "sshKeyPath",
  "sshPrivateKey",
  "token",
] as const;

export const PROVIDER_PACKET_REDACTED_FIELD_PATHS = [
  "targetHost.address",
  "provider.accountId",
  "provider.orderId",
  "provider.projectId",
  "provider.dashboardSession",
  "access.sshPrivateKey",
  "access.sshPrivateKeyPath",
  "access.providerToken",
  "cloudInit.rawUserData",
  "cloudInit.rawRenderedTemplate",
  "install.environment",
  "provenance.operatorLocalPath",
] as const;

export const PROVIDER_PACKET_SUPPORT_BUNDLE_SAFE_PATHS = [
  "schema",
  "schemaVersion",
  "stage",
  "provenance.generatedBy",
  "provenance.sourceRef",
  "provenance.readinessSource",
  "provenance.capacitySource",
  "provider.id",
  "provider.name",
  "provider.automationLevel",
  "region.id",
  "region.readinessStatus",
  "size.planName",
  "size.ramGB",
  "size.vCPU",
  "size.storageGB",
  "osImage.distribution",
  "osImage.version",
  "access.username",
  "access.sshPublicKeyLabel",
  "access.sshPublicKeyFingerprint",
  "cloudInit.mode",
  "cloudInit.userDataSha256",
  "install.mode",
  "install.sourceRef",
  "compatibility.workloadId",
  "compatibility.targetAgents",
  "compatibility.selectedPlanStatus",
  "compatibility.readinessStatus",
  "verificationCommands[].id",
  "expectedArtifacts[].id",
  "expectedArtifacts[].pathPattern",
] as const;

export const PROVIDER_PACKET_EXPECTED_ARTIFACTS = [
  {
    id: "provider-order-confirmation",
    pathPattern: "provider-console://orders/<redacted-order-id>",
    producedBy: "provider",
    supportBundleSafe: false,
    redactionRequired: true,
  },
  {
    id: "installer-log",
    pathPattern: "~/.acfs/logs/install-*.log",
    producedBy: "installer",
    supportBundleSafe: true,
    redactionRequired: true,
  },
  {
    id: "support-report",
    pathPattern: "~/.acfs/support/<timestamp>/support-report.md",
    producedBy: "installer",
    supportBundleSafe: true,
    redactionRequired: true,
  },
  {
    id: "support-manifest",
    pathPattern: "~/.acfs/support/<timestamp>/manifest.json",
    producedBy: "installer",
    supportBundleSafe: true,
    redactionRequired: true,
  },
] as const satisfies readonly ProviderProvisioningPacketExpectedArtifact[];

export const PROVIDER_PACKET_BASE_VERIFICATION_COMMANDS = [
  {
    id: "ssh-root",
    label: "Root SSH reaches the new VPS",
    command: "ssh root@<target-host>",
    runLocation: "local",
    expectedStatus: "pass",
    supportBundleSafe: false,
  },
  {
    id: "installer",
    label: "ACFS installer exits successfully",
    command: "<install-command>",
    runLocation: "vps",
    expectedStatus: "pass",
    supportBundleSafe: true,
  },
  {
    id: "doctor",
    label: "ACFS doctor passes or reports only documented warnings",
    command: "acfs doctor",
    runLocation: "vps",
    expectedStatus: "pass",
    supportBundleSafe: true,
  },
  {
    id: "support-bundle",
    label: "Redacted support bundle can be produced",
    command: "acfs support-bundle",
    runLocation: "vps",
    expectedStatus: "pass",
    supportBundleSafe: true,
  },
] as const satisfies readonly ProviderProvisioningPacketVerificationCommand[];

export const PROVIDER_PACKET_MANUAL_STEPS_BY_PROVIDER: Record<string, string[]> = {
  contabo: [
    "Log in to the provider console and choose the ACFS-recommended VPS product.",
    "Select the desired region and Ubuntu image from the provider UI.",
    "Paste or select the public SSH key for root access.",
    "Complete checkout and payment manually.",
    "Copy the assigned host address into the wizard; do not store it in a support-safe packet projection.",
  ],
  ovh: [
    "Log in to the provider console and choose the ACFS-recommended VPS product.",
    "Select the desired region and Ubuntu image from the provider UI.",
    "Attach the public SSH key or use the provider password flow until the installer installs keys.",
    "Complete checkout and payment manually.",
    "Copy the assigned host address into the wizard; do not store it in a support-safe packet projection.",
  ],
  other: [
    "Verify the provider offers SSH access, Ubuntu 24.04 or newer, and enough RAM, CPU, and NVMe storage.",
    "Complete account, checkout, and payment steps manually.",
    "Record the assigned host address outside the support-safe packet projection.",
  ],
};

export function manualStepsForProvider(providerId: string): string[] {
  return PROVIDER_PACKET_MANUAL_STEPS_BY_PROVIDER[providerId] ?? PROVIDER_PACKET_MANUAL_STEPS_BY_PROVIDER.other;
}
