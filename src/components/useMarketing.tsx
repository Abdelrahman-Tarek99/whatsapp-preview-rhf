import { useEffect, useCallback, useState } from "react";
import {
  Control,
  UseFormUnregister,
  UseFormSetValue,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFormWatch,
  UseFormGetValues,
} from "react-hook-form";
import {
  Variable,
  TargetType,
  WhatsappFormValues,
  ButtonType,
} from "../types/Whatsapp.types";
import { MarketingDropDown, UtilityDropDown } from "./WhatsappFormConstants";
import { useTranslation } from "react-i18next";
import { useErrorToast } from "../hooks/useErrorToast";

interface UseMarketingProps {
  control: Control<WhatsappFormValues> | undefined;
  unregister?: UseFormUnregister<WhatsappFormValues>;
  setValue: UseFormSetValue<WhatsappFormValues>;
  appendHeaderVar: UseFieldArrayAppend<WhatsappFormValues, "headerVariables">;
  removeHeaderVar: UseFieldArrayRemove;
  appendBodyVar: UseFieldArrayAppend<WhatsappFormValues, "bodyVariables">;
  removeBodyVar: UseFieldArrayRemove;
  replaceHeaderVar: UseFieldArrayReplace<WhatsappFormValues, "headerVariables">;
  replaceBodyVar: UseFieldArrayReplace<WhatsappFormValues, "bodyVariables">;
  watch: UseFormWatch<WhatsappFormValues> | undefined;
  removeButton: UseFieldArrayRemove;
  getValues?: UseFormGetValues<WhatsappFormValues>;
  appendButton: UseFieldArrayAppend<WhatsappFormValues, "buttons">;
  templateType: string;
}

export function useMarketing({
  unregister,
  setValue,
  appendHeaderVar,
  removeHeaderVar,
  appendBodyVar,
  removeBodyVar,
  replaceBodyVar,
  replaceHeaderVar,
  watch,
  removeButton,
  getValues,
  appendButton,
  templateType,
}: UseMarketingProps) {
  const { t } = useTranslation();
  const header = watch?.("header") ?? "";
  const body = watch?.("body") ?? "";
  const footer = watch?.("footer") ?? "";
  const headerVariables = watch?.("headerVariables") ?? [];
  const bodyVariables = watch?.("bodyVariables") ?? [];
  const buttons = watch?.("buttons") ?? [];
  const [buttonTypeError, setButtonTypeError] = useState(false);
  const [buttonTypeErrorMessage, setButtonTypeErrorMessage] = useState("");
  
  // Use the error toast hook
  useErrorToast(
    buttonTypeError,
    buttonTypeErrorMessage,
    buttonTypeErrorMessage,
  );

  // Reset error state after showing toast
  useEffect(() => {
    if (buttonTypeError) {
      const timer = setTimeout(() => {
        setButtonTypeError(false);
        setButtonTypeErrorMessage("");
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [buttonTypeError]);

  // Find all placeholders in a text
  const findPlaceholders = useCallback((text: string): number[] => {
    const placeholders: number[] = [];
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      placeholders.push(parseInt(match[1]));
    }
    return placeholders;
  }, []);

  // Synchronize variables array with placeholders
  const syncVariablesWithPlaceholders = useCallback(
    (target: TargetType, placeholders: number[]) => {
      const isHeader = target === "HEADER";
      const originalText = isHeader ? header : body;
      const variables = isHeader ? headerVariables : bodyVariables;
      const replace = isHeader ? replaceHeaderVar : replaceBodyVar;
      const setText = (val: string) =>
        setValue?.(isHeader ? "header" : "body", val);
      const fullName = isHeader ? "headerVariables" : "bodyVariables";

      if (!originalText) return;

      // Step 1: Clean and reindex placeholders
      const sortedUnique = [...new Set(placeholders.filter((n) => n > 0))].sort(
        (a, b) => a - b,
      );

      // Step 2: Build new variable list using old values if available
      const newVariables = sortedUnique.map((originalIdx) => {
        const zeroBased = originalIdx - 1;
        const stableVariables = getValues?.(fullName) ?? [];

        const value = stableVariables[zeroBased]?.value ?? "";

        return { value };
      });

      // Step 3: Normalize placeholder text (only reindex, do not touch spaces)
      let i = 1;
      const normalizedText = originalText.replace(
        /\{\{(\d+)\}\}/g,
        () => `{{${i++}}}`,
      );

      // Step 4: Unregister any removed fields
      for (let i = newVariables.length; i < variables.length; i++) {
        unregister?.(`${fullName}.${i}.value` as any);
      }

      // Step 5: Update form state
      replace(newVariables);
      setText(normalizedText);
    },
    [header, body],
  );

  useEffect(() => {
    const headerPlaceholders = findPlaceholders(header);
    syncVariablesWithPlaceholders("HEADER", headerPlaceholders);
  }, [header]);

  useEffect(() => {
    const bodyPlaceholders = findPlaceholders(body);
    syncVariablesWithPlaceholders("BODY", bodyPlaceholders);
  }, [body]);

  // Replace variables in text for preview
  const replaceVariables = useCallback(
    (text: string, variables: Variable[]): string => {
      if (!text) return "";
      return text.replace(/\{\{(\d+)\}\}/g, (_, index: string) => {
        const variableValue =
          variables[parseInt(index) - 1]?.value || `{{${index}}}`;
        //! where we update the variable values
        return `${variableValue}`;
      });
    },
    [],
  );

  // Shift placeholders after removal
  const shiftPlaceholders = useCallback(
    (text: string, removedIndex: number): string => {
      return text
        .replace(/\{\{(\d+)\}\}/g, (_, matchIndex: string) => {
          const index = parseInt(matchIndex);
          if (index === removedIndex + 1) return "";
          if (index > removedIndex + 1) return `{{${index - 1}}}`;
          return `{{${index}}}`;
        })
        .replace(/\s+/g, " ")
        .trim();
    },
    [],
  );

  // Handle variable removal
  const handleRemoveVariable = useCallback(
    (target: TargetType, indexToRemove: number) => {
      if (target === "HEADER") {
        const updatedHeader = shiftPlaceholders(header, indexToRemove);
        removeHeaderVar(indexToRemove);
        setValue?.("header", updatedHeader);
      } else if (target === "BODY") {
        const updatedBody = shiftPlaceholders(body, indexToRemove);
        removeBodyVar(indexToRemove);
        setValue?.("body", updatedBody);
      }
    },
    [header, body, removeHeaderVar, removeBodyVar, setValue, shiftPlaceholders],
  );

  // Handle variable addition
  const handleAddVariable = useCallback(
    (target: TargetType) => {
      const isHeader = target === "HEADER";
      const text = isHeader ? header : body;
      const variables = isHeader ? headerVariables : bodyVariables;
      const append = isHeader ? appendHeaderVar : appendBodyVar;
      const updateText = isHeader
        ? (val: string) => setValue?.("header", val)
        : (val: string) => setValue?.("body", val);

      const newIndex = variables.length + 1;
      append({ value: "" });

      const trimmedText = text.trim();

      // ✨ Add space before if text doesn't end in space or {
      const needsSpaceBefore =
        !trimmedText.endsWith(" ") && !trimmedText.endsWith("{");
      const updatedText =
        trimmedText + (needsSpaceBefore ? " " : "") + `{{${newIndex}}}`;
      updateText(updatedText.trim());
    },
    [header, body, appendHeaderVar, appendBodyVar, setValue],
  );

  const handleAddButton = useCallback(() => {
    const buttons = watch?.("buttons") ?? [];
    const availableTypes =
      templateType === "Utility" ? UtilityDropDown : MarketingDropDown;
    const maxButtonsPerType = 2;
    const maxTotalButtons = availableTypes.length * maxButtonsPerType;

    const typeCounts = buttons.reduce(
      (acc: Record<string, number>, btn: ButtonType) => {
        acc[btn.buttonType] = (acc[btn.buttonType] ?? 0) + 1;
        return acc;
      },
      {} as Record<"URL" | "CALL" | "OFFER_CODE", number>,
    );

    const typePriority: ("URL" | "CALL" | "OFFER_CODE")[] = availableTypes.map(
      (type) => type.value as "URL" | "CALL" | "OFFER_CODE",
    );

    const availableType = typePriority.find(
      (type) => (typeCounts[type] ?? 0) < maxButtonsPerType,
    );

    if (!availableType) {
      setButtonTypeError(true);
      setButtonTypeErrorMessage(
        t("whatsapp.buttonLimitDynamic", {
          max: maxTotalButtons,
        }),
      );
      return;
    }

    const newButton = {
      buttonType: availableType,
      text: "",
      url: availableType === "URL" ? "" : undefined,
      phone: availableType === "CALL" ? "" : undefined,
    };

    appendButton(newButton as ButtonType);
  }, [watch, appendButton, templateType, t]);

  const handleButtonTypeChange = (
    index: number,
    newType: "URL" | "CALL" | "OFFER_CODE",
    fieldOnChange: (val: string) => void,
  ) => {
    const currentButtons = getValues?.("buttons") ?? [];

    const countOfType = currentButtons.filter(
      (btn: ButtonType, i: number) => i !== index && btn.buttonType === newType,
    ).length;

    if (countOfType >= 2) {
      setButtonTypeError(true);
      setButtonTypeErrorMessage(
        `${t("whatsapp.buttonLimitDynamic")} ${newType}`,
      );
      return;
    }

    fieldOnChange(newType); // proceed if valid
  };

  const handleRemoveButton = useCallback(
    (index: number) => {
      unregister?.(`buttons.${index}.buttonType` as any);
      unregister?.(`buttons.${index}.text` as any);
      unregister?.(`buttons.${index}.url` as any);
      unregister?.(`buttons.${index}.phone` as any);
      removeButton(index);
    },
    [removeButton, unregister],
  );

  return {
    replaceVariables,
    handleRemoveVariable,
    handleAddVariable,
    header,
    body,
    footer,
    headerVariables,
    bodyVariables,
    buttons,
    handleButtonTypeChange,
    handleRemoveButton,
    handleAddButton,
  };
}
