# Translations

- Every language is one complete file in `locales/`, with the keys in the order
  of `en.ts`. There are no overlay files.
- A new or changed English string goes into `en.ts` and every other language
  file. Follow the copy rules in the **Text** section of
  [docs/development/web-ui-layout-rules.md](../../../docs/development/web-ui-layout-rules.md).
- `translations.test.ts` (`corepack pnpm --dir web test`) checks missing and
  extra keys, placeholders, link tags and the copy rules.

To add a language, add `locales/<key>.ts` with every key of `en.ts` (it is
picked up automatically) and add its key and name to `languages.ts`.
- Plural strings use i18next's suffixes (`key_one`, `key_other`, and `_few`, `_many`
  where the language has them). A language needs exactly the forms i18next asks for;
  the test checks it. A missing form falls back to English.
