import { Box, Container, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import colors from "@nadabot/theme/colors";
import ProtectedPage from "@nadabot/components/auth/ProtectedPage";
import Input from "@nadabot/components/pages/add-stamp/Input";
import ContractInfo from "@nadabot/components/ContractInfo";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import CustomButton from "@nadabot/components/ui/CustomButton";
import UploadImage from "@nadabot/components/UploadImage";

const formSchema = Yup.object().shape({
  title: Yup.string().min(4, "Insert a valid title").required("Required"),
  description: Yup.string()
    .min(4, "Insert a valid description")
    .required("Required"),
  contractName: Yup.string()
    .min(4, "Insert a valid contract name")
    .required("Required"),
  method: Yup.string().min(4, "Insert a valid method").required("Required"),
  externalLink: Yup.string()
    .min(4, "Insert a valid external link")
    .required("Required"),
});

export default function AddStampPage() {
  const { maxWidth1200, maxWidth962, maxWidth600, maxWidth430 } =
    useBreakPoints();

  const { openFilePicker, filesContent } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png", "svg"]),
      new FileSizeValidator({ maxFileSize: 4 * 1024 * 1024 /* 4 MB */ }),
    ],
  });

  console.log(filesContent);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      contractName: "",
      method: "",
      externalLink: "",
      gas: 0,
    },
    validationSchema: formSchema,
    onSubmit: async (
      { title, description, contractName, method, externalLink, gas },
      { setSubmitting }
    ) => {
      setSubmitting(true);
    },
  });

  return (
    <ProtectedPage>
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
            <UploadImage
              onClick={openFilePicker}
              previewFileContent={filesContent[0]?.content}
            />
            <Input
              disabled={formik.isSubmitting}
              label="Title"
              placeholder="Enter a title"
              errorMessage={formik.errors.title}
              sx={{ mt: 2 }}
            />
            <Input
              disabled={formik.isSubmitting}
              label="Description"
              placeholder="Describe what this check is"
              errorMessage={formik.errors.description}
              sx={{ mt: 2 }}
            />
            <Input
              disabled={formik.isSubmitting}
              label="Contract Name"
              placeholder="Enter a contract name"
              errorMessage={formik.errors.contractName}
              sx={{ mt: 2 }}
            />
            <Input
              disabled={formik.isSubmitting}
              label="Method"
              placeholder="Enter a method"
              info="Method must take single input and return boolean"
              errorMessage={formik.errors.method}
              sx={{ mt: 2 }}
            />
            <Input
              disabled={formik.isSubmitting}
              label="External link"
              placeholder="Enter an external link"
              errorMessage={formik.errors.externalLink}
              sx={{ mt: 2 }}
            />
            <Input
              disabled={formik.isSubmitting}
              label="Minimum Required Gas Units, TGas"
              placeholder="Enter the minimum TGas units"
              type="number"
              errorMessage={formik.errors.gas}
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
                sx={{
                  minWidth: maxWidth430 ? "initial" : 392,
                  backgroundColor: colors.WHITE,
                }}
                hidePoints
              />
            </Box>
          </Stack>
        </Stack>
        {/* Buttons */}
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          mt={2}
          mb={2}
        >
          <CustomButton
            bodySize="medium"
            color="beige"
            sx={{ width: maxWidth600 ? "40%" : "25%" }}
          >
            Go Back
          </CustomButton>
          <CustomButton
            bodySize="medium"
            color="blue"
            sx={{ width: maxWidth600 ? "58%" : "73%" }}
          >
            Final Submit
          </CustomButton>
        </Stack>
      </Container>
    </ProtectedPage>
  );
}
