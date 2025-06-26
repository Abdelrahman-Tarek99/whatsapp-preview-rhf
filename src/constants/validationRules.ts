export const validationRules = {
  required: {
    required: "This field is required",
  },
  header: {
    maxLength: {
      value: 60,
      message: "Header must be 60 characters or less",
    },
  },
  body: {
    maxLength: {
      value: 1024,
      message: "Body must be 1024 characters or less",
    },
  },
  footer: {
    maxLength: {
      value: 60,
      message: "Footer must be 60 characters or less",
    },
  },
}; 