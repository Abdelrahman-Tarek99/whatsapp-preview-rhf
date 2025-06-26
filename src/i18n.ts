import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      whatsapp: {
        header: "Header",
        body: "Body", 
        footer: "Footer",
        header_placeholder: "Enter header text...",
        body_placeholder: "Enter body text...",
        footer_placeholder: "Enter footer text...",
        add_header_variables: "Add Header Variables",
        add_body_variables: "Add Body Variables",
        enter_value: "Enter value",
        add_button: "Add Button",
        type: "Type",
        button_text: "Button Text",
        enter_label: "Enter label",
        website_url: "Website URL",
        enter_url: "Enter URL",
        phone_number: "Phone Number",
        url: "URL",
        call: "Call",
        website_offerCode: "Offer Code",
        buttonLimitDynamic: "Maximum buttons reached",
        english: "English",
        english_us: "English (US)",
        english_uk: "English (UK)",
        arabic: "Arabic"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 