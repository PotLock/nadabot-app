import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: ProviderId;
  groupId?: GroupExternal["id"];
};
