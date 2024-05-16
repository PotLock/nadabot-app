import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: ProviderExternal["id"];
};
