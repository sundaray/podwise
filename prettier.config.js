module.exports = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<BUILTIN_MODULES>",
    "^react$",
    "^next(.*)$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/app/(.*)$",
  ],
  importOrderMergeDuplicateImports: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};
