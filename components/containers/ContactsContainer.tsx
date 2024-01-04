import { Stack } from "@mui/material";
import React from "react";
import { ContactInfo } from "../ContactInfo";

type Props = {};

export function ContactsContainer({}: Props) {
  return (
    <Stack mt={2}>
      <ContactInfo />
      <ContactInfo />
      <ContactInfo />
    </Stack>
  );
}
