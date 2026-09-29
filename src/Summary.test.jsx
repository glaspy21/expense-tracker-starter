import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Summary from './Summary'

describe('Summary', () => {
  it('totals income, expenses and balance', () => {
    const transactions = [
      { id: 1, type: 'income', amount: 1000 },
      { id: 2, type: 'expense', amount: 300 },
      { id: 3, type: 'expense', amount: 200 },
    ]
    render(<Summary transactions={transactions} />)

    expect(screen.getByText('$1000', { selector: '.income-amount' })).toBeInTheDocument()
    expect(screen.getByText('$500', { selector: '.expense-amount' })).toBeInTheDocument()
    expect(screen.getByText('$500', { selector: '.balance-amount' })).toBeInTheDocument()
  })

  it('sums string amounts numerically instead of concatenating', () => {
    const transactions = [
      { id: 1, type: 'income', amount: '100' },
      { id: 2, type: 'income', amount: '50' },
    ]
    render(<Summary transactions={transactions} />)

    expect(screen.getByText('$150', { selector: '.income-amount' })).toBeInTheDocument()
  })
})
