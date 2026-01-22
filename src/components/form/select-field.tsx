"use client";

import { useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { get } from "react-hook-form";

export default function SelectField({
  name,
  label,
  disabled,
  options,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as string | undefined;

  return (
    <Field>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Combobox>
        <ComboboxInput
          type="text"
          id={name}
          placeholder={label}
          autoComplete="off"
          disabled={disabled}
          {...register(name, {
            onChange: async () => {
              await trigger(name);
            },
          })}
        />
        <ComboboxContent>
          {options.map((option) => (
            <ComboboxItem key={option.value} value={option.value}>
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </Combobox>
      {error && <FieldError errors={[{ message: error as string }]} />}
    </Field>
  );
}
