module.exports = {
  extends: ["next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2021, // Enables ES2021 syntax
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  env: {
    browser: true, // Sets the environment to browser (if you're building a React app)
    es6: true, // Enables ES6 globals like `Set`
    node: true,
  },
  rules: {
    // Your other rules...

    // Ignore the 'jsx-a11y/anchor-is-valid' rule
    "jsx-a11y/anchor-is-valid": "off",
    // Disable strict TypeScript rules that might cause issues
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // Allow exhaustive-deps warnings but don't fail build
    "react-hooks/exhaustive-deps": "warn",
  },
};
