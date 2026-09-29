import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TransactionForm from './TransactionForm'

const categories = ['food', 'salary']

describe('TransactionForm', () => {
  it('submits a new transaction with a numeric amount', async () => {
    const onAdd = vi.fn()
    render(<TransactionForm categories={categories} onAddTransaction={onAdd} />)

    await userEvent.type(screen.getByPlaceholderText('Description'), 'Coffee')
    await userEvent.type(screen.getByPlaceholderText('Amount'), '4.5')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Coffee',
        amount: 4.5,
        type: 'expense',
        category: 'food',
      })
    )
  })

  it('ignores submits with a missing description or amount', async () => {
    const onAdd = vi.fn()
    render(<TransactionForm categories={categories} onAddTransaction={onAdd} />)

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
  })
})
