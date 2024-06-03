import { ProviderId } from "./providers";

export type GroupId = number;

export enum RulePrimitiveType {
  Highest = "Highest",
  Lowest = "Lowest",
}

export enum RuleGenericType {
  Sum = "Sum",
  DiminishingReturns = "DiminishingReturns",
  IncreasingReturns = "IncreasingReturns",
}

export type RuleType =
  | keyof typeof RulePrimitiveType
  | keyof typeof RuleGenericType;

export type Rule =
  | keyof typeof RulePrimitiveType
  | {
      /** Sum all scores with optional max value */
      [RuleGenericType.Sum]: number | null | undefined;
    }
  | {
      /** Sum with diminishing returns, factor in percentage (e.g., 10 for 10% reduction each) */
      [RuleGenericType.DiminishingReturns]: number;
    }
  | {
      /** Sum with increasing returns, factor in percentage (e.g., 10 for 10% increase each) */
      [RuleGenericType.IncreasingReturns]: number;
    };

export type Group = {
  name: string;
  rule: Rule;
};

export type GroupExternal = Group & {
  id: GroupId;
  providers: ProviderId[];
};

export interface GroupById {
  group_id: GroupId;
}

export interface CreateGroup extends Pick<GroupExternal, "rule" | "providers"> {
  group_name: GroupExternal["name"];
}

export interface UpdateGroup
  extends GroupById,
    Partial<Pick<GroupExternal, "rule" | "providers">> {
  group_name?: GroupExternal["name"];
}
