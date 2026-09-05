import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: ["coverage/**"],
  },
  ...coreWebVitals,
  {
    settings: {
      react: {
        version: "19.2.0",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
