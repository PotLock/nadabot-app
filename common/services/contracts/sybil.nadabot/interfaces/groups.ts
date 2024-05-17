import { ProviderId } from "./providers";

export type GroupId = number;

type RuleTypePrimitive = "Highest" | "Lowest";

enum RuleTypeGeneric {
  Sum = "Sum",
  DiminishingReturns = "DiminishingReturns",
  IncreasingReturns = "IncreasingReturns",
}

export type Rule =
  | RuleTypePrimitive
  | {
      /** Sum all scores with optional max value */
      [RuleTypeGeneric.Sum]: number | null | undefined;
    }
  | {
      /** Sum with diminishing returns, factor in percentage (e.g., 10 for 10% reduction each) */
      [RuleTypeGeneric.DiminishingReturns]: number;
    }
  | {
      /** Sum with increasing returns, factor in percentage (e.g., 10 for 10% increase each) */
      [RuleTypeGeneric.IncreasingReturns]: number;
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

export type AddOrUpdateGroupInput = Pick<
  GroupExternal,
  "rule" | "providers"
> & {
  group_name: GroupExternal["name"];
};
