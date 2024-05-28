import { StampEditor } from "@nadabot/modules/stamps/StampEditor";

import StampPageLayout from "./layout";

export default function StampCreatePage() {
  return (
    <StampPageLayout>
      <StampEditor />
    </StampPageLayout>
  );
}
