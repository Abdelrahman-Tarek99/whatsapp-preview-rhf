import React, { useEffect } from "react";
import { ExtendedWhatsappFormProps, Variable } from "../types/Whatsapp.types";
import { Controller, useFieldArray } from "react-hook-form";
import { useMarketing } from "./useMarketing";
import {
  MarketingDropDown,
  UtilityDropDown,
} from "./WhatsappFormConstants";
import { validationRules } from "../constants/validationRules";
import { useTranslation } from "react-i18next";
import { IconBackspace, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { PreviewSection } from "./PreviewSection";

// Custom styled components to replace EDS components
const Button = ({ 
  label, 
  size = "medium", 
  state = "default", 
  type = "default", 
  onClick, 
  disabled, 
  buttonVariant, 
  icon, 
  className = "" 
}: {
  label: string;
  size?: "small" | "medium" | "large";
  state?: "default" | "disabled";
  type?: "default" | "withIcon";
  onClick?: () => void;
  disabled?: boolean;
  buttonVariant?: "link";
  icon?: React.ReactNode;
  className?: string;
}) => {
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const baseClasses = "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95";
  
  // Enhanced variant classes with better visibility
  const variantClasses = buttonVariant === "link" 
    ? "bg-transparent text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200" 
    : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || state === "disabled"}
      title={label} // Add tooltip for better UX
    >
      {type === "withIcon" && icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {label}
    </button>
  );
};

const InputField = ({ 
  type = "text", 
  placeHolder, 
  label, 
  inputError, 
  isRequired, 
  disabled, 
  value, 
  onChange, 
  onBlur, 
  className = "",
  style = {}
}: {
  type?: "text" | "textarea";
  placeHolder?: string;
  label?: string;
  inputError?: string;
  isRequired?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorClasses = inputError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  return (
    <div className={className} style={style}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          className={`${baseClasses} ${errorClasses} resize-none`}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          rows={4}
        />
      ) : (
        <input
          type="text"
          className={`${baseClasses} ${errorClasses}`}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
      )}
      {inputError && (
        <p className="mt-1 text-sm text-red-600">{inputError}</p>
      )}
    </div>
  );
};

const PhoneInputField = ({ 
  label, 
  placeholder, 
  isRequired, 
  error, 
  disabled, 
  value, 
  onChange, 
  onBlur, 
  className = "",
  style = {}
}: {
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  error?: { message?: string };
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";

  return (
    <div className={className} style={style}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="tel"
        className={`${baseClasses} ${errorClasses}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export const WhatsappMarketingUtilitySecondStep: React.FC<
  ExtendedWhatsappFormProps
> = ({
  control,
  watch,
  setValue,
  formState,
  unregister,
  getValues,
  templateType,
  drawerMode,
}) => {
  const { t } = useTranslation();
  const [exampleLoaded, setExampleLoaded] = React.useState(false);
  
  const {
    fields: headerFields,
    append: appendHeaderVar,
    replace: replaceHeaderVar,
    remove: removeHeaderVar,
  } = useFieldArray({
    control,
    name: "headerVariables",
  });

  const {
    fields: bodyFields,
    append: appendBodyVar,
    replace: replaceBodyVar,
    remove: removeBodyVar,
  } = useFieldArray({ control, name: "bodyVariables" });

  const {
    fields: buttonFields,
    append: appendButton,
    remove: removeButton,
  } = useFieldArray({
    control,
    name: "buttons",
  });

  const {
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
  } = useMarketing({
    watch,
    control,
    unregister,
    setValue,
    appendHeaderVar,
    removeHeaderVar,
    appendBodyVar,
    removeBodyVar,
    replaceHeaderVar,
    replaceBodyVar,
    removeButton,
    getValues,
    appendButton,
    templateType: templateType || "Marketing",
  });

  useEffect(() => {
    if (headerVariables) {
      headerVariables.forEach((variable: Variable, index: number) => {
        setValue(`headerVariables.${index}.value`, variable.value);
      });
    }
    if (bodyVariables) {
      bodyVariables.forEach((variable: Variable, index: number) => {
        setValue(`bodyVariables.${index}.value`, variable.value);
      });
    }
  }, [headerVariables, bodyVariables, setValue]);

  return (
    <div className="flex h-full gap-4">
      <div className="flex flex-col gap-4 w-3/5">
        {/* Sample Example Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Template Writing Guide</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">How to Use Variables</h4>
              <p className="text-sm text-blue-700 mb-3">
                Use <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-mono text-xs">{"{{1}}"}</code>, <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-mono text-xs">{"{{2}}"}</code>, etc. to create dynamic placeholders. Click "Add Variables" buttons to automatically insert them.
              </p>
            </div>
            
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Sample Template:</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Header:</span>
                  <span className="text-gray-600 ml-2">Good news {"{{1}}"}!</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Body:</span>
                  <span className="text-gray-600 ml-2">Your order #{"{{2}}"} is on its way to {"{{3}}"}. Expected delivery: {"{{4}}"}. Thank you for your order!</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Footer:</span>
                  <span className="text-gray-600 ml-2">Track your order at Amazon</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Variables will be replaced with actual values when the message is sent</span>
            </div>
            
            <div className="pt-2">
              <Button
                label={exampleLoaded ? "Example Loaded ✓" : "Try This Example"}
                size="small"
                type="default"
                disabled={exampleLoaded}
                onClick={() => {
                  setValue("header", "Good news {{1}}!");
                  setValue("body", "Your order #{{2}} is on its way to {{3}}. Expected delivery: {{4}}. Thank you for your order!");
                  setValue("footer", "Track your order at Amazon");
                  
                  // Add variables
                  appendHeaderVar({ value: "John" });
                  appendBodyVar({ value: "ORD-12345" });
                  appendBodyVar({ value: "123 Main St, City" });
                  appendBodyVar({ value: "Tomorrow by 3 PM" });
                  appendBodyVar({ value: "tracking.example.com" });
                  
                  // Add a button
                  appendButton({
                    buttonType: "URL",
                    text: "Track Order",
                    url: "https://tracking.example.com"
                  });
                  
                  // Mark example as loaded
                  setExampleLoaded(true);
                }}
                className={`${
                  exampleLoaded 
                    ? "!bg-gray-400 !text-gray-600 cursor-not-allowed" 
                    : "!bg-blue-600 hover:!bg-blue-700 text-white hover:text-white border border-blue-600 hover:border-blue-700"
                } shadow-sm hover:shadow-md transition-all duration-200 font-medium`}
              />
            </div>
          </div>
        </div>

        {/* Header Field */}
        <Controller
          name="header"
          control={control}
          defaultValue=""
          rules={{ ...validationRules.header, ...validationRules.required }}
          render={({ field }) => (
            <div className="relative w-[100%]">
              <InputField
                type="text"
                placeHolder={t("whatsapp.header_placeholder")}
                label={t("whatsapp.header")}
                inputError={formState?.errors.header?.message}
                isRequired={true}
                disabled={drawerMode === "view"}
                {...field}
              />
            </div>
          )}
        />
        <Button
          label={t("whatsapp.add_header_variables")}
          size="medium"
          state={drawerMode === "view" ? "disabled" : "default"}
          type="default"
          onClick={() => handleAddVariable("HEADER")}
          className="!bg-blue-600 hover:!bg-blue-700 text-white hover:text-white border border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
        />
        {headerFields.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Header Variables ({headerFields.length})</h4>
            {headerFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center mb-3 last:mb-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">{`{{${index + 1}}}`}</span>
                </div>
                <InputField
                  type="text"
                  disabled
                  placeHolder={`{{${index + 1}}}`}
                  className="text-center bg-white border-blue-200 flex-shrink-0"
                />
                <Controller
                  control={control}
                  name={`headerVariables.${index}.value`}
                  rules={{ ...validationRules.header, ...validationRules.required }}
                  render={({ field }) => (
                    <div className="flex-1">
                      <InputField
                        type="text"
                        placeHolder={t("whatsapp.enter_value")}
                        disabled={drawerMode === "view"}
                        isRequired
                        inputError={
                          formState?.errors.headerVariables?.[index]?.value?.message
                        }
                        {...field}
                      />
                    </div>
                  )}
                />

                <Button
                  buttonVariant="link"
                  icon={
                    <IconBackspace
                      className={`transform ${document.dir === "rtl" ? "rotate-180" : ""}`}
                    />
                  }
                  label=""
                  size="small"
                  state={drawerMode === "view" ? "disabled" : "default"}
                  type="withIcon"
                  onClick={() => handleRemoveVariable("HEADER", index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0"
                />
              </div>
            ))}
          </div>
        )}

        {/* Body Field */}
        <Controller
          name="body"
          control={control}
          defaultValue=""
          rules={{ ...validationRules.body, ...validationRules.required }}
          render={({ field }) => (
            <div className="relative w-[100%]">
              <InputField
                type="textarea"
                placeHolder={t("whatsapp.body_placeholder")}
                label={t("whatsapp.body")}
                inputError={formState?.errors.body?.message}
                isRequired={true}
                disabled={drawerMode === "view"}
                {...field}
              />
            </div>
          )}
        />
        <Button
          label={t("whatsapp.add_body_variables")}
          size="medium"
          state={drawerMode === "view" ? "disabled" : "default"}
          type="default"
          onClick={() => handleAddVariable("BODY")}
          className="!bg-purple-600 hover:!bg-purple-700 text-white hover:text-white border border-purple-600 hover:border-purple-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
        />
        {bodyFields.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-900 mb-3">Body Variables ({bodyFields.length})</h4>
            {bodyFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center mb-3 last:mb-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold text-xs">{`{{${index + 1}}}`}</span>
                </div>
                <InputField
                  type="text"
                  disabled
                  placeHolder={`{{${index + 1}}}`}
                  className="text-center bg-white border-purple-200 flex-shrink-0"
                />
                <Controller
                  control={control}
                  name={`bodyVariables.${index}.value`}
                  rules={{ ...validationRules.body, ...validationRules.required }}
                  render={({ field }) => (
                    <div className="flex-1">
                      <InputField
                        type="text"
                        placeHolder={t("whatsapp.enter_value")}
                        disabled={drawerMode === "view"}
                        isRequired
                        inputError={
                          formState?.errors.bodyVariables?.[index]?.value?.message
                        }
                        {...field}
                      />
                    </div>
                  )}
                />
                <Button
                  buttonVariant="link"
                  icon={
                    <IconBackspace
                      className={`transform ${document.dir === "rtl" ? "rotate-180" : ""}`}
                    />
                  }
                  label=""
                  size="small"
                  state={drawerMode === "view" ? "disabled" : "default"}
                  type="withIcon"
                  onClick={() => handleRemoveVariable("BODY", index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer Field */}
        <Controller
          name="footer"
          defaultValue=""
          control={control}
          rules={{ ...validationRules.footer, ...validationRules.required }}
          render={({ field }) => (
            <div className="relative w-[100%]">
              <InputField
                type="text"
                placeHolder={t("whatsapp.footer_placeholder")}
                label={t("whatsapp.footer")}
                inputError={formState?.errors.footer?.message}
                disabled={drawerMode === "view"}
                isRequired
                {...field}
              />
            </div>
          )}
        />

        {/* Enhanced Add Button Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Interactive Buttons
              </h3>
              <p className="text-sm text-gray-600">
                Add interactive buttons to your WhatsApp template. You can include URL links, phone numbers, or offer codes.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {buttonFields.length}/6 buttons
              </span>
            </div>
          </div>
          
          <Button
            label={`${t("whatsapp.add_button")} (${buttonFields.length}/6)`}
            buttonVariant="link"
            icon={<IconPlus color="#fff" />}
            size="medium"
            state={drawerMode === "view" ? "disabled" : "default"}
            type="withIcon"
            className="!bg-green-600 hover:!bg-green-700 text-white hover:text-white border border-green-600 hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold w-full sm:w-auto"
            onClick={handleAddButton}
          />
          
          {buttonFields.length === 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>No buttons added yet.</strong> Click the button above to add interactive elements to your template.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {buttonFields.map((field, index) => {
          const type = watch?.(`buttons.${index}.buttonType`);
          return (
            <div key={field.id} className="border border-gray-200 p-6 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-xs">{`{{${index + 1}}}`}</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Button {index + 1}</h4>
                </div>
                <Button
                  onClick={() => handleRemoveButton(index)}
                  label=""
                  icon={
                    <IconBackspace
                      className={`transform ${document.dir === "rtl" ? "rotate-180" : ""}`}
                    />
                  }
                  buttonVariant="link"
                  state={drawerMode === "view" ? "disabled" : "default"}
                  size="small"
                  type="withIcon"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Select - Fixed width */}
                <div className="md:col-span-1">
                  <Controller
                    name={`buttons.${index}.buttonType`}
                    control={control}
                    render={({ field }) => {
                      const options: { value: string; label: string }[] =
                        templateType === "Utility"
                          ? UtilityDropDown
                          : MarketingDropDown;

                      return (
                        <div className="relative w-full">
                          <label
                            htmlFor={`buttons.${index}.buttonType`}
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            {t("whatsapp.type")}
                          </label>
                          <select
                            className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              const newValue = e.target.value as
                                | "URL"
                                | "CALL"
                                | "OFFER_CODE";
                              handleButtonTypeChange(
                                index,
                                newValue,
                                field.onChange,
                              );
                            }}
                            disabled={drawerMode === "view"}
                          >
                            {options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute top-1/2 right-3 transform translate-y-[15%] text-gray-500">
                            <IconChevronDown size={18} />
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>

                {/* Text Input - Flexible width */}
                <div className="md:col-span-1">
                  <Controller
                    name={`buttons.${index}.text`}
                    control={control}
                    rules={validationRules.required}
                    render={({ field }) => (
                      <InputField
                        label={t("whatsapp.button_text")}
                        {...field}
                        isRequired
                        placeHolder={t("whatsapp.enter_label")}
                        inputError={
                          formState?.errors?.buttons?.[index]?.text
                            ?.message as string
                        }
                        disabled={drawerMode === "view"}
                        type="text"
                      />
                    )}
                  />
                </div>

                {/* URL/Phone Input - Flexible width */}
                <div className="md:col-span-1">
                  {type === "URL" && (
                    <Controller
                      name={`buttons.${index}.url`}
                      control={control}
                      rules={validationRules.required}
                      render={({ field }) => (
                        <InputField
                          isRequired
                          label={t("whatsapp.website_url")}
                          {...field}
                          placeHolder={t("whatsapp.enter_url")}
                          disabled={drawerMode === "view"}
                          inputError={
                            formState?.errors?.buttons?.[index]?.url
                              ?.message as string
                          }
                          type="text"
                        />
                      )}
                    />
                  )}
                  {type === "CALL" && (
                    <Controller
                      name={`buttons.${index}.phone`}
                      control={control}
                      rules={validationRules.required}
                      render={({ field }) => (
                        <PhoneInputField
                          className=""
                          isRequired
                          label={t("whatsapp.phone_number")}
                          placeholder={"eg.515020716"}
                          error={formState?.errors?.buttons?.[index]?.phone}
                          disabled={drawerMode === "view"}
                          {...field}
                          value={field.value || ""}
                        />
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PreviewSection
        header={header}
        body={body}
        footer={footer}
        headerVariables={headerVariables}
        bodyVariables={bodyVariables}
        buttons={buttons}
        replaceVariables={replaceVariables}
      />
    </div>
  );
};
