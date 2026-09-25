# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A small React 19 + Vite 7 expense tracker (package name `finance-tracker`). It is a course starter project (see README) that intentionally ships with a bug, poor UI, and messy code, so expect rough edges rather than established conventions. Plain JavaScript/JSX, no TypeScript, no router, no backend.

## Commands

```bash
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the built output
npm run lint      # eslint .
```

There is no test framework configured, so there is no test command.

Lint notes (`eslint.config.js`): `no-unused-vars` is an error, but names starting with an uppercase letter or `_` are exempt. React Hooks and react-refresh (Vite) rules are enabled.

## Architecture

The entire app lives in `src/App.jsx`, a single `App` component (mounted in `src/main.jsx` under `StrictMode`). Styling is in `src/App.css` (component styles) and `src/index.css` (global).

- **State**: all `useState` inside `App`. `transactions` is seeded with hardcoded sample data and is not persisted, so a page reload resets it. Form fields and the two filters (`filterType`, `filterCategory`) each have their own state.
- **Derived values**: income, expense and balance totals plus `filteredTransactions` are recomputed on every render from `transactions`. There is no memoization or reducer.
- **Categories**: a hardcoded `categories` array inside the component feeds both the add-form select and the filter select.
- **Transaction shape**: `{ id, description, amount, type: "income" | "expense", category, date }`. New entries get `id: Date.now()` and today's date.

## Known issues

- `amount` is stored as a **string** (both in the seed data and from the number input in `handleSubmit`). The totals use `reduce((sum, t) => sum + t.amount, 0)`, so they concatenate strings instead of adding. Convert with `Number(...)` at input time or when summing.
- Seed transaction "Freelance Work" (id 4) is typed as `expense` with category `salary`, which looks like a data mistake.
- The table has no delete/edit column, although the header markup leaves a gap where one was likely removed.
