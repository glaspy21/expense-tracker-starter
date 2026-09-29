# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A small React 19 + Vite 7 expense tracker (package name `finance-tracker`). It is a course starter project (see README) that intentionally ships with a bug, poor UI, and messy code, so expect rough edges rather than established conventions. Plain JavaScript/JSX, no TypeScript, no router, no backend. The only runtime dependency besides React is `recharts`, used for the spending chart.

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

`App.jsx` (mounted in `src/main.jsx` under `StrictMode`) holds the `transactions` state and seed data, and composes four child components (`Summary`, `SpendingChart`, `TransactionForm`, `TransactionList`, rendered in that order). Styling is in `src/App.css` (component styles, shared by all of them) and `src/index.css` (global).

- **`App`**: owns `transactions` (seeded with hardcoded sample data, not persisted, so a page reload resets it) and the `categories` array, which it passes down to `TransactionForm` and `TransactionList`. `handleAddTransaction` appends a new transaction to state and is passed to `TransactionForm` as `onAddTransaction`; `handleDeleteTransaction` removes a transaction by `id` and is passed to `TransactionList` as `onDeleteTransaction`.
- **`Summary.jsx`**: takes `transactions` as a prop and derives income, expense and balance totals from it on every render (no memoization or reducer). Renders the three summary cards.
- **`SpendingChart.jsx`**: takes `transactions` as a prop and, on every render, sums expense amounts (converted with `Number(...)`) per category, sorted descending. Renders a Recharts `BarChart` inside a `ResponsiveContainer`, or a "No expenses to show yet." message when there are no expenses. Bar colors come from a local `categoryColors` map keyed by category, falling back to the `other` color, so a new category in `App` needs an entry there to get its own color. Styles are `.spending-chart` and `.chart-empty` in `App.css`.
- **`TransactionForm.jsx`**: owns the add-transaction form field state (`description`, `amount`, `type`, `category`) and `handleSubmit`, which builds the new transaction object (`id: Date.now()`, today's date) and calls `onAddTransaction`. Takes `categories` for its category select.
- **`TransactionList.jsx`**: owns the two filter states (`filterType`, `filterCategory`) and derives `filteredTransactions` from the `transactions` prop on every render. Renders the filter selects and the transactions table, including a per-row Delete button that confirms via `window.confirm` before calling the `onDeleteTransaction(id)` prop. Takes `categories` for its filter select.
- **Categories**: the hardcoded `categories` array lives in `App` and is passed as a prop to both `TransactionForm` and `TransactionList`, which each feed it into a select.
- **Transaction shape**: `{ id, description, amount, type: "income" | "expense", category, date }`. New entries get `id: Date.now()` and today's date, with `amount` converted to a `Number` in `TransactionForm`.

## Known issues

- Seed data still stores `amount` as a **string**. `Summary` and `TransactionForm` convert with `Number(...)` (at sum time and input time respectively), so totals are correct, but a seed transaction's `amount` is a string until edited.
- Seed transaction "Freelance Work" (id 4) is typed as `expense` with category `salary`, which looks like a data mistake.
- The table has no edit column.
