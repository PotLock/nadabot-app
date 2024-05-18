import { GroupId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

export enum DIALOGS {
  None,
  NoConnected,
  StampSent,
  Error,
  ViewProvider,
  ConfirmVerification,
  GroupDialog,
}

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: ProviderId;
  groupId?: GroupId;
};
