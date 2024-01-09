import { Box, Container, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import colors from "@nadabot/theme/colors";
import Input from "@nadabot/components/pages/add-stamp/Input";
import ContractInfo from "@nadabot/components/ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";

export default function AddStampPage() {
  const { maxWidth1200, maxWidth962 } = useBreakPoints();

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
        mb={1}
        mt={4}
        borderRadius="12px"
        boxShadow={`0px 0px 8px 0px ${colors.SHADOWGRAY}`}
        border={`1px solid ${colors.SHADOWGRAY}`}
        direction={maxWidth962 ? "column-reverse" : "row"}
      >
        {/* Inputs */}
        <Stack
          width={maxWidth962 ? "100%" : maxWidth1200 ? "50%" : "60%"}
          p={4}
        >
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
          <Input
            label="Method"
            placeholder="Enter a method"
            info="Method must take single input and return boolean"
            sx={{ mt: 2 }}
          />
          <Input
            label="External link"
            placeholder="Enter an external link"
            sx={{ mt: 2 }}
          />
          <Input
            label="Minimum Required Gas Units, TGas"
            placeholder="Enter the minimum TGas units"
            type="number"
            optional
            sx={{ mt: 2 }}
          />
        </Stack>

        {/* Preview */}
        <Stack
          width={maxWidth962 ? "100%" : maxWidth1200 ? "50%" : "40%"}
          alignItems={maxWidth1200 ? "center" : "flex-start"}
          bgcolor={colors.GRAY100}
          p={4}
          borderLeft={`1px solid ${colors.SHADOWGRAY}`}
        >
          <Stack direction="row" alignItems="center">
            <Typography fontWeight={700} fontSize={24} mr={1}>
              Stamp Card Preview
            </Typography>
            <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
          </Stack>
          <Typography fontWeight={400} color={colors.NEUTRAL400}>
            This is the preview of your submitted Stamp
          </Typography>

          <Box mt={4}>
            <ContractInfo
              sx={{ minWidth: 392, backgroundColor: colors.WHITE }}
              hidePoints
            />
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
