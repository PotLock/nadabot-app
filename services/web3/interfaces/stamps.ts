import { ProviderExternal } from "./providers";

export interface StampExternal {
  user_id: string;
  provider: ProviderExternal;
  validated_at_ms: number;
}
