import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirnamePath
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "coverage/**", "node_modules/**", "out/**", "next-env.d.ts"]
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports"
        }
      ],
      "react/no-unescaped-entities": "off"
    }
  }
];

export default eslintConfig;
