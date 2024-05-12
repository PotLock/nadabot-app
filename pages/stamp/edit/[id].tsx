import { useRouter } from "next/router";

import StampPageLayout from "@nadabot/components/stamp/layout";
import { StampEditor } from "@nadabot/components/stamp/StampEditor";

export default function StampEditPage() {
  const router = useRouter();

  if (Array.isArray(router.query.id)) {
    return router.back();
  }

  return (
    <StampPageLayout>
      <StampEditor id={router.query.id} />
    </StampPageLayout>
  );
}
