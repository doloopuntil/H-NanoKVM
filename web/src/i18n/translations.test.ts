import i18next from 'i18next';
import { describe, expect, it } from 'vitest';

import languages from './languages';
import { getResources } from './resources';

type Strings = Record<string, string>;

const resources = getResources();

// Strings that are legitimately the same as English: technical terms and product names.
const sameAsEnglish = new Set(['picoclaw.model.apiBase']);

function flatten(node: unknown, prefix = '', out: Strings = {}): Strings {
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (typeof value === 'string') {
      out[prefix + key] = value;
    } else if (value && typeof value === 'object') {
      flatten(value, `${prefix}${key}.`, out);
    } else {
      throw new Error(`${prefix + key} is not a string`);
    }
  }
  return out;
}

// The names inside {{ }}, so reordering them in a translation is fine but dropping one is not.
function placeholders(text: string): string[] {
  return [...text.matchAll(/\{\{\s*([^,}\s]+)/g)].map((m) => m[1]).sort();
}

// The <a1></a1> style tags that mark where a link goes in a sentence.
function tags(text: string): string[] {
  return [...text.matchAll(/<\/?([a-z][a-z0-9]*)>/g)].map((m) => m[1]).sort();
}

function words(text: string): number {
  return text.split(/\s+/).filter((word) => /[a-z]{3,}/i.test(word)).length;
}

// Texts that rightly start in lower case: units, technical terms, file names and sentence fragments
// that are put together in code.
const lowerCaseStarts = new Set([
  'settings.about.mdns',
  'settings.device.minutes',
  'settings.device.mdns.description',
  'settings.systemLog.viewer.linesUnit',
  'settings.tailscale.package',
  'settings.tailscale.unzip',
  'settings.tailscale.upTailscale',
  'settings.tailscale.upTailscaled',
  'image.tips.tfCard',
  'image.tips.tf3',
  'image.tips.tf5',
  'picoclaw.model.modelIdentifierPlaceholder',
  'picoclaw.model.apiBasePlaceholder'
]);

const english = flatten(resources.en.translation);

// i18next resolves plurals as key_one, key_few, ... with the categories of the language; a missing
// one falls back to English, so every language needs exactly the suffixes i18next asks for.
const pluralSuffix = /_(zero|one|two|few|many|other)$/;
const pluralBases = [...new Set(Object.keys(english).filter((key) => /_one$/.test(key)))].map(
  (key) => key.replace(pluralSuffix, '')
);
const resolver = i18next.createInstance();
await resolver.init({ resources, lng: 'en' });

function suffixes(language: string): string[] {
  const service = (
    resolver.services as unknown as {
      pluralResolver: { getSuffixes: (lng: string) => string[] };
    }
  ).pluralResolver;
  // se is the file behind sv; as a code of its own i18next would read it as Northern Sami
  return service.getSuffixes(language === 'se' ? 'sv' : language);
}

// The keys a language must have: English's, with each plural key in the language's own forms.
function expectedKeys(language: string): string[] {
  const plain = Object.keys(english).filter(
    (key) => !pluralBases.includes(key.replace(pluralSuffix, ''))
  );
  const plurals = pluralBases.flatMap((base) => suffixes(language).map((suffix) => base + suffix));
  return [...plain, ...plurals];
}

// The English text a key is compared with; the plural forms all follow English's "other".
function reference(key: string): string {
  return pluralBases.includes(key.replace(pluralSuffix, ''))
    ? english[`${key.replace(pluralSuffix, '')}_other`]
    : english[key];
}

const translated = Object.keys(resources).filter((language) => language !== 'en');

describe('languages', () => {
  it('lists exactly the languages that have a locale file', () => {
    // no and sv are the locale files behind the nb and se translations
    const listed = languages.map((language) => language.key).sort();
    const present = Object.keys(resources)
      .filter((language) => !['nb', 'se'].includes(language))
      .sort();
    expect(listed).toEqual(present);
  });
});

describe.each(translated)('%s translation', (language) => {
  const strings = flatten(resources[language].translation);

  it('has every English key, plurals in its own forms', () => {
    const missing = expectedKeys(language).filter((key) => !(key in strings));
    expect(missing).toEqual([]);
  });

  it('has no key that English lacks', () => {
    const expected = new Set(expectedKeys(language));
    const extra = Object.keys(strings).filter((key) => !expected.has(key));
    expect(extra).toEqual([]);
  });

  it('has no empty string', () => {
    const empty = Object.keys(strings).filter((key) => strings[key].trim() === '');
    expect(empty).toEqual([]);
  });

  it('uses the same placeholders as English', () => {
    const mismatched = Object.keys(strings).filter(
      (key) => placeholders(strings[key]).join() !== placeholders(reference(key)).join()
    );
    expect(mismatched).toEqual([]);
  });

  it('keeps the same link tags as English', () => {
    const mismatched = Object.keys(strings).filter(
      (key) => tags(strings[key]).join() !== tags(reference(key)).join()
    );
    expect(mismatched).toEqual([]);
  });

  it('has no space before a question mark', () => {
    const spaced = Object.keys(strings).filter((key) =>
      /[\s\u00a0\u202f\u2009]\?/.test(strings[key])
    );
    expect(spaced).toEqual([]);
  });

  it('has no parentheses and no exclamation mark', () => {
    const found = Object.keys(strings).filter((key) => /[()（）!！]/.test(strings[key]));
    expect(found).toEqual([]);
  });

  it('starts every text with a capital letter', () => {
    const lower = Object.keys(strings).filter((key) => {
      const first = strings[key].replace(/^[¿¡"'«“„<]+/, '')[0];
      return (
        !lowerCaseStarts.has(key) &&
        first !== undefined &&
        first !== first.toUpperCase() &&
        first.toLowerCase() !== first.toUpperCase()
      );
    });
    expect(lower).toEqual([]);
  });

  it('uses the straight apostrophe', () => {
    const curly = Object.keys(strings).filter((key) => /\p{L}\u2019\p{L}/u.test(strings[key]));
    expect(curly).toEqual([]);
  });

  it('has no doubled or edge spaces', () => {
    const spaced = Object.keys(strings).filter((key) => /^\s|\s$|\s{2}/.test(strings[key]));
    expect(spaced).toEqual([]);
  });

  // Thai writes no full stops or question marks
  it.skipIf(language === 'th')('ends with a full stop or a question mark as English does', () => {
    // "Min." is the German abbreviation, the full stop belongs to it
    const abbreviations = new Set(['settings.device.minutes']);
    const ending = (text: string) =>
      /[.。]$/.test(text.trim()) ? '.' : /[?？]$/.test(text.trim()) ? '?' : '';
    const different = Object.keys(strings).filter(
      (key) => !abbreviations.has(key) && ending(strings[key]) !== ending(reference(key))
    );
    expect(different).toEqual([]);
  });

  it('does not leave sentences in English', () => {
    const untranslated = Object.keys(strings).filter(
      (key) =>
        strings[key] === reference(key) && words(reference(key)) >= 3 && !sameAsEnglish.has(key)
    );
    expect(untranslated).toEqual([]);
  });
});
