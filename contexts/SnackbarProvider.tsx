import { Stack, Typography } from "@mui/material";
import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import ErrorDialog from "@nadabot/components/dialogs/ErrorDialog";
import NoConnectedDialog from "@nadabot/components/dialogs/NoConnectedDialog";
import StampSentDialog from "@nadabot/components/dialogs/StampSentDialog";
import ViewProviderDialog from "@nadabot/components/dialogs/ViewProviderDialog";
import colors from "@nadabot/theme/colors";
import { FC, createContext, useCallback, useState } from "react";

type OpenSnackbarProps = {
  description: string;
  actionText?: string;
  bgColor?: "blue" | "red";
  onClickActionText?: () => void;
};

type SnackbarContextProps = {
  showSnackbar: (props: OpenSnackbarProps) => void;
};

export const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {
    throw new Error("showSnackbar must be defined");
  },
});

type Props = {
  children: JSX.Element;
};

const SnackbarProvider: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [props, setProps] = useState<OpenSnackbarProps>({
    description: "",
    actionText: "",
    bgColor: "blue",
    onClickActionText: () => {},
  });

  const showSnackbar = useCallback((props: OpenSnackbarProps) => {
    setProps({
      description: props.description,
      actionText: props.actionText || "",
      bgColor: props.bgColor || "blue",
      onClickActionText: props.onClickActionText,
    });
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 9000);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {open && (
        <Stack
          height="40px"
          bgcolor={props.bgColor === "blue" ? colors.BLUE : colors.ERROR_RED}
          justifyContent="center"
          alignItems="center"
          direction="row"
          position="fixed"
          bottom={0}
          zIndex={1000}
          width="100%"
        >
          <Typography color={colors.WHITE}>{props.description}</Typography>
          {props.actionText && (
            <ButtonContainer onClick={props.onClickActionText}>
              <Typography
                color={colors.WHITE}
                sx={{ textDecoration: "underline", ml: 1 }}
              >
                {props.actionText}
              </Typography>
            </ButtonContainer>
          )}
        </Stack>
      )}
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
