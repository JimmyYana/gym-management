import type { ComponentProps } from "react";
import { Select } from "@/components/atoms/controls";
import { FormField } from "@/components/molecules/form-field";
import { memberOptionLabel, memberOptions, paymentMethods } from "@/constants/member-options";

export function PaymentField({ id, current, error, ...props }: ComponentProps<"select"> & { current: string; error?: string }) {
  const options = memberOptions(paymentMethods, current);
  return (
    <FormField label="Método de pago" htmlFor={id} error={error}>
      <Select id={id} {...props}>{options.map((option) => <option key={option} value={option}>{memberOptionLabel(option)}</option>)}</Select>
    </FormField>
  );
}
