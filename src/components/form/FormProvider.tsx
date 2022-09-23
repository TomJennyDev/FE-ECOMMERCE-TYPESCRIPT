import { ReactNode } from "react";
import { FormProvider as RHFormProvider, UseFormReturn } from "react-hook-form";

interface FormProviderProps {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
}

function FormProvider({ children, onSubmit, methods }: FormProviderProps) {
  return (
    <RHFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </RHFormProvider>
  );
}

export default FormProvider;
