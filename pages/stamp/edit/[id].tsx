import { useRouter } from "next/router";

import StampPageLayout from "@nadabot/pages/_components/stamp/layout";
import { StampEditor } from "@nadabot/pages/_components/stamp/StampEditor";

export default function StampEditPage() {
  const router = useRouter();

  if (typeof router.query.id !== "string") {
    return router.back();
  }

  return (
    <StampPageLayout>
      <StampEditor id={parseInt(router.query.id)} />
    </StampPageLayout>
  );
}
