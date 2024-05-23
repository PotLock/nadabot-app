import { Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import colors from "@nadabot/common/ui/colors";
import ButtonContainer from "@nadabot/common/ui/components/ButtonContainer";

import { OpenSnackbarProps, SnackbarContext } from "../utils/snackbar";

type Props = {
  children: JSX.Element;
};

const SnackbarProvider: React.FC<Props> = ({ children }) => {
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
          zIndex={9999}
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
