export type BridgeElementStatus = "healthy" | "warning" | "critical";

export type BridgeElementCategory =
  | "deck"
  | "pier"
  | "girder"
  | "bearing"
  | "joint"
  | "cable"
  | "abutment"
  | "railing"
  | "foundation"
  | "unknown";

export type BridgeModelPart = {
  id: string;
  name: string;
  visible: boolean;
  isolated?: boolean;
};

export type BridgeElementRecord = {
  id: string;
  objectName: string;
  title: string;
  code: string;
  category: BridgeElementCategory;
  status: BridgeElementStatus;
  description: string;
  inspectionDate?: string;
  inspector?: string;
  riskScore?: number;
  maintenanceNote?: string;
  updatedAt?: string;
};
