import { Container, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import colors from "@nadabot/common/ui/theme/colors";
import useDialogs from "@nadabot/hooks/useDialogs";
import useTransactionDetection from "@nadabot/hooks/useTransactionDetection";
import ProtectedPage from "@nadabot/pages/_components/auth/ProtectedPage";

import { DIALOGS } from "../_components/types";

export default function StampPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { openDialog } = useDialogs();
  // Check if there was an transaction, if so, show the "Done" Dialog
  const transactionCompleted = useTransactionDetection();

  useEffect(() => {
    if (transactionCompleted) {
      openDialog({ dialog: DIALOGS.StampSent });
    }
  }, [transactionCompleted, openDialog]);

  return (
    <ProtectedPage>
      <Container>
        <Tooltip
          title={
            <Link href="https://docs.nada.bot/" target="_blank">
              See the Docs here
            </Link>
          }
        >
          <Stack>
            <Typography variant="h4" fontWeight={700}>
              {`${typeof router.query.id === "string" ? "Edit" : "Add"} Stamp/Check`}
            </Typography>

            <Typography color={colors.SECONDARY} fontSize={16}>
              A stamp is a smart-contract enabled check on NEAR to be added to
              the nadabot sybil registry, to verify something about an account
              whether it be a role, identity, proof of ownership, or behavior.
            </Typography>
          </Stack>
        </Tooltip>

        {children}
      </Container>
    </ProtectedPage>
  );
}
