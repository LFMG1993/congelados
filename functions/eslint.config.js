import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

/**
 * Configuración de ESLint para Cloud Functions usando el nuevo formato "flat config".
 */
export default tseslint.config(
  // Archivos y directorios a ignorar
  {
    ignores: ["lib/", "generated/"],
  },
  // Configuraciones recomendadas
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Configuración personalizada
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "require-jsdoc": "off", // Desactivamos esta regla común de Google que puede ser muy estricta.
    },
  }
);