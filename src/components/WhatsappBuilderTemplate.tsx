import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

interface Variable {
  value: string;
}

interface FormValues {
  header: string;
  body: string;
  footer: string;
  headerVariables: Variable[];
  bodyVariables: Variable[];
  buttonType: "text" | "call";
  url: string;
  phone: string;
}

type TargetType = "header" | "body";

export default function WhatsAppTemplateBuilder() {
  const { register, control, watch, setValue, handleSubmit, unregister } =
    useForm<FormValues>({
      defaultValues: {
        header: "",
        body: "",
        footer: "",
        headerVariables: [],
        bodyVariables: [],
        buttonType: "text",
        url: "",
        phone: "",
      },
    });

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
  } = useFieldArray({
    control,
    name: "bodyVariables",
  });

  const header = watch("header");
  const body = watch("body");
  const footer = watch("footer");
  const buttonType = watch("buttonType");
  const url = watch("url");
  const phone = watch("phone");
  const headerVariables = watch("headerVariables");
  const bodyVariables = watch("bodyVariables");

  useEffect(() => {
    if (buttonType === "text") {
      unregister("phone");
    } else if (buttonType === "call") {
      unregister("url");
    }
  }, [buttonType, unregister]);

  const replaceVariables = (text: string, variables: Variable[]): string => {
    return text.replace(/\{\{(\d+)\}\}/g, (_, index: string) => {
      const variableValue =
        variables[parseInt(index) - 1]?.value || `{{${index}}}`;
      return `**${variableValue}**`;
    });
  };

  const shiftPlaceholders = (text: string, removedIndex: number): string => {
    return text
      .replace(/\{\{(\d+)\}\}/g, (_, matchIndex: string) => {
        const index = parseInt(matchIndex);
        if (index === removedIndex + 1) return ""; // Remove current one
        if (index > removedIndex + 1) return `{{${index - 1}}}`; // Shift down
        return `{{${index}}}`;
      })
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleRemoveVariable = (target: TargetType, indexToRemove: number) => {
    if (target === "header") {
      const updatedHeader = shiftPlaceholders(header, indexToRemove);
      removeHeaderVar(indexToRemove);
      const newVariables = headerVariables.filter(
        (_, idx) => idx !== indexToRemove
      );
      setValue("header", updatedHeader);
      replaceHeaderVar(newVariables);
    } else if (target === "body") {
      const updatedBody = shiftPlaceholders(body, indexToRemove);
      removeBodyVar(indexToRemove);
      const newVariables = bodyVariables.filter(
        (_, idx) => idx !== indexToRemove
      );
      setValue("body", updatedBody);
      replaceBodyVar(newVariables);
    }
  };

  const handleAddVariable = (target: TargetType) => {
    if (target === "header") {
      const newIndex = headerFields.length + 1;
      appendHeaderVar({ value: "" });
      setValue("header", (header + ` {{${newIndex}}}`).trim());
    } else if (target === "body") {
      const newIndex = bodyFields.length + 1;
      appendBodyVar({ value: "" });
      setValue("body", (body + ` {{${newIndex}}}`).trim());
    }
  };

  return (
    <form
      className="flex flex-col md:flex-row gap-8 p-6"
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <DevTool control={control} placement="top-right" />
      <div className="w-full md:w-1/2 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Header Title"
            className="border p-2 w-full"
            {...register("header")}
          />
          <button
            type="button"
            onClick={() => handleAddVariable("header")}
            className="mt-2 bg-blue-500 text-white px-4 py-2"
          >
            Add Variable to Header
          </button>
          {headerFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center mt-2">
              <input
                className="border p-2 w-1/3 text-center bg-gray-100"
                value={`{{${index + 1}}}`}
                readOnly
              />
              <input
                className="border p-2 w-2/3"
                placeholder="Enter value"
                {...register(`headerVariables.${index}.value` as const)}
              />
              <button
                type="button"
                onClick={() => handleRemoveVariable("header", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div>
          <textarea
            className="border p-2 w-full"
            rows={4}
            {...register("body")}
          />
          <button
            type="button"
            onClick={() => handleAddVariable("body")}
            className="mt-2 bg-blue-500 text-white px-4 py-2"
          >
            Add Variable to Body
          </button>
          {bodyFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center mt-2">
              <input
                className="border p-2 w-1/3 text-center bg-gray-100"
                value={`{{${index + 1}}}`}
                readOnly
              />
              <input
                className="border p-2 w-2/3"
                placeholder="Enter value"
                {...register(`bodyVariables.${index}.value` as const)}
              />
              <button
                type="button"
                onClick={() => handleRemoveVariable("body", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Footer</h3>
          <input
            type="text"
            placeholder="Footer text"
            className="border p-2 w-full"
            {...register("footer")}
          />

          <h3 className="font-semibold">Footer Button</h3>
          <select {...register("buttonType")} className="border p-2 w-full">
            <option value="text">Visit Website</option>
            <option value="call">Call Number</option>
          </select>

          {buttonType === "text" && (
            <input
              type="text"
              placeholder="Enter Website URL"
              className="border p-2 w-full"
              {...register("url")}
            />
          )}

          {buttonType === "call" && (
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="border p-2 w-full"
              {...register("phone")}
            />
          )}
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      <div className="w-full md:w-1/2 bg-[#ece5dd] p-6 rounded-lg">
        <div className="bg-white rounded-lg shadow p-4 max-w-xs mx-auto">
          <div className="text-xs text-gray-500 mb-2">Today, 14:00</div>
          <div className="bg-green-100 p-3 rounded-lg mb-2">
            <strong className="block mb-1">
              {replaceVariables(header, headerVariables)}
            </strong>
            <div>{replaceVariables(body, bodyVariables)}</div>
          </div>
          {footer && <div className="text-xs text-gray-600 mt-2">{footer}</div>}
          <div className="mt-2 space-y-2">
            {buttonType === "text" && url && (
              <button className="w-full border border-blue-500 text-blue-500 py-1 rounded">
                {url}
              </button>
            )}
            {buttonType === "call" && phone && (
              <button className="w-full border border-green-500 text-green-500 py-1 rounded">
                Call {phone}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
