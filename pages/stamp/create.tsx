import { StampEditor } from "@nadabot/features/stamps/StampEditor";

import StampPageLayout from "./layout";

export default function StampCreatePage() {
  return (
    <StampPageLayout>
      <StampEditor />
    </StampPageLayout>
  );
}
