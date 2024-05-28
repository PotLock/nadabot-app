import { useRouter } from "next/router";

import { StampEditor } from "@nadabot/modules/stamps/components/StampEditor";

import StampPageLayout from "../layout";

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
