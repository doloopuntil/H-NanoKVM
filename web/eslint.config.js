import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig(
    { ignores: ['dist', 'public/mockServiceWorker.js'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'react-hooks/exhaustive-deps': 'warn',
            // React Compiler rules of react-hooks 7. A site that is right as written gets a
            // line-level disable with its reason; do not turn a rule off for the whole project.
            'react-hooks/set-state-in-effect': 'error',
            'react-hooks/refs': 'error',
            'react-hooks/immutability': 'error',
            'react-hooks/purity': 'error',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    eslintConfigPrettier
)
