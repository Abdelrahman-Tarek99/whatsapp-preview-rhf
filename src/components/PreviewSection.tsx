import React from "react";
import { ButtonType, Variable } from "../types/Whatsapp.types";
import whatsappBG  from "../assets/whatsappBG.png";
import { renderButton } from "../utils/buttonRenderer";

interface PreviewSectionProps {
  header: string;
  body: string;
  footer?: string;
  headerVariables: Variable[];
  bodyVariables: Variable[];
  buttons: ButtonType[];
  replaceVariables: (text: string, variables: Variable[]) => string;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  header,
  body,
  footer,
  headerVariables,
  bodyVariables,
  buttons,
  replaceVariables,
}) => {
  return (
    <div className="flex items-center justify-center w-2/5">
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[600px] bg-gray-800 rounded-[3rem] shadow-3xl border-4 border-gray-800">
        {/* Phone Speaker */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800 rounded-full"></div>

        {/* Phone Screen */}
        <div className="absolute top-8 left-2 right-2 bottom-8 bg-white rounded-[2rem] overflow-hidden">
          {/* WhatsApp Background and Content */}
          <div
            className="h-full w-full p-4 overflow-y-auto relative"
            style={{
              background: `url(${whatsappBG}) repeat`,
              backgroundSize: "200px",
              backgroundPosition: "center",
              opacity: 0.7,
            }}
          >
            {/* Message Container */}
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs mx-auto mt-4 relative z-10">
              <div className="text-xs text-gray-500 mb-2">
                {new Date().toLocaleString()}
              </div>
              <div className="bg-green-100 p-3 rounded-lg mb-2 break-all">
                <strong className="block mb-1">
                  {replaceVariables(header, headerVariables)}
                </strong>
                <div>{replaceVariables(body, bodyVariables)}</div>
              </div>
              {footer && (
                <div className="text-base text-gray-600 mt-2">{footer}</div>
              )}
              <div className="mt-2 space-y-2">
                {buttons.map((button, index) => (
                  <div key={index}>{renderButton(button, index)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Home Button/Line */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};
