module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
  },
  rules: {
    quotes: "off",
    semi: "off",
    "comma-dangle": "off",
    "@typescript-eslint/quotes": ["warn", "double"],
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-misused-promises": "off",
  },
};
