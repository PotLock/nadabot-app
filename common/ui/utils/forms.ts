import { FormikErrors } from "formik";
import { useEffect } from "react";

export const useFormErrorLogger = <FormSchema>(
  errors: FormikErrors<FormSchema>,
) =>
  useEffect(
    () =>
      Object.values(errors).forEach((messages) =>
        (Array.isArray(messages) ? messages : [messages]).forEach((message) =>
          console.warn(message),
        ),
      ),

    [errors],
  );
