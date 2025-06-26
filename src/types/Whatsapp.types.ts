import { Control, UseFormWatch, UseFormSetValue, FieldErrors, UseFormUnregister, UseFormGetValues } from "react-hook-form";

export interface Variable {
  value: string;
}

export type TargetType = "HEADER" | "BODY";

export type ButtonTypeValue = "URL" | "CALL" | "OFFER_CODE";

export interface ButtonType {
  buttonType: ButtonTypeValue;
  text: string;
  url?: string;
  phone?: string;
}

export interface WhatsappFormValues {
  header: string;
  body: string;
  footer: string;
  headerVariables: Variable[];
  bodyVariables: Variable[];
  buttons: ButtonType[];
}

export interface ExtendedWhatsappFormProps {
  control: Control<WhatsappFormValues>;
  watch: UseFormWatch<WhatsappFormValues>;
  setValue: UseFormSetValue<WhatsappFormValues>;
  formState: { errors: FieldErrors<WhatsappFormValues> };
  unregister: UseFormUnregister<WhatsappFormValues>;
  getValues: UseFormGetValues<WhatsappFormValues>;
  templateType?: string;
  drawerMode?: string;
} 