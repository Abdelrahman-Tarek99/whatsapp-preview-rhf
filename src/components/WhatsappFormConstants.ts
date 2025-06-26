import { useTranslation } from "react-i18next";

export const useMarketingDropDown = () => {
  const { t } = useTranslation();
  return [
    {
      value: "URL",
      label: t("whatsapp.url"),
    },
    {
      value: "CALL",
      label: t("whatsapp.call"),
    },
    {
      value: "OFFER_CODE",
      label: t("whatsapp.website_offerCode"),
    },
  ];
};

export const useUtilityDropDown = () => {
  const { t } = useTranslation();
  return [
    {
      value: "URL",
      label: t("whatsapp.url"),
    },
    {
      value: "CALL",
      label: t("whatsapp.call"),
    },
  ];
};

// Static versions for backward compatibility
export const MarketingDropDown = [
  {
    value: "URL",
    label: "URL",
  },
  {
    value: "CALL",
    label: "Call",
  },
  {
    value: "OFFER_CODE",
    label: "Offer Code",
  },
];

export const UtilityDropDown = [
  {
    value: "URL",
    label: "URL",
  },
  {
    value: "CALL",
    label: "Call",
  },
];

export const WhatsappLanguage = [
  { key: "en", node: "English" },
  { key: "en_US", node: "English (US)" },
  { key: "en_GB", node: "English (UK)" },
  { key: "ar", node: "Arabic" },
];
