import { Container, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import colors from "@nadabot/theme/colors";
import Input from "@nadabot/components/pages/add-stamp/Input";

export default function AddStampPage() {
  return (
    <Container>
      <Stack>
        <Typography variant="h4" fontWeight={700}>
          Add Stamp/Check
        </Typography>
        <Typography color={colors.SECONDARY} fontSize={16}>
          A stamp is...
        </Typography>
      </Stack>

      {/* Stamp Inputs and Preview */}
      <Stack
        p={4}
        mb={1}
        mt={4}
        borderRadius="12px"
        boxShadow={`0px 0px 8px 0px ${colors.SHADOWGRAY}`}
        border={`1px solid ${colors.SHADOWGRAY}`}
      >
        {/* Inputs */}
        <Stack>
          <Input label="Title" placeholder="Enter a title" />
          <Input
            label="Description"
            placeholder="Describe what this check is"
            sx={{ mt: 2 }}
          />
          <Input
            label="Contract Name"
            placeholder="Enter a contract name"
            sx={{ mt: 2 }}
          />
          <Input label="Method" placeholder="Enter a method" sx={{ mt: 2 }} />
          <Input
            label="External link"
            placeholder="Enter an external link"
            sx={{ mt: 2 }}
          />
        </Stack>

        {/* Preview */}
        <Stack>
          <Stack direction="row" alignItems="center">
            <Typography fontWeight={700} fontSize={24} mr={1}>
              Stamp Card Preview
            </Typography>
            <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
