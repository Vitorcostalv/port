import next from "eslint-config-next";

/** Flat config — `next lint` foi removido no Next 16, o ESLint roda direto. */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      // versão estática legada, fora do app Next
      "script.js",
      "index.html",
    ],
  },
  ...next,
];

export default config;
