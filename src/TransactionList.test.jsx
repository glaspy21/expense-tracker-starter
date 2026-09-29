import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TransactionList from './TransactionList'

const categories = ['food', 'salary']
const transactions = [
  { id: 1, description: 'Groceries', amount: 50, type: 'expense', category: 'food', date: '2026-01-01' },
  { id: 2, description: 'Paycheck', amount: 900, type: 'income', category: 'salary', date: '2026-01-02' },
]

const setup = (onDeleteTransaction = vi.fn()) => {
  render(
    <TransactionList
      transactions={transactions}
      categories={categories}
      onDeleteTransaction={onDeleteTransaction}
    />
  )
  return onDeleteTransaction
}

afterEach(() => vi.restoreAllMocks())

describe('TransactionList', () => {
  it('shows all transactions by default', () => {
    setup()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Paycheck')).toBeInTheDocument()
  })

  it('filters by type', async () => {
    setup()
    const [typeSelect] = screen.getAllByRole('combobox')
    await userEvent.selectOptions(typeSelect, 'income')

    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
    expect(screen.getByText('Paycheck')).toBeInTheDocument()
  })

  it('filters by category', async () => {
    setup()
    const categorySelect = screen.getAllByRole('combobox')[1]
    await userEvent.selectOptions(categorySelect, 'food')

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.queryByText('Paycheck')).not.toBeInTheDocument()
  })

  it('deletes a transaction after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onDelete = setup()
    await userEvent.click(screen.getAllByText('Delete')[0])

    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('does not delete when confirmation is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onDelete = setup()
    await userEvent.click(screen.getAllByText('Delete')[0])

    expect(onDelete).not.toHaveBeenCalled()
  })
})
