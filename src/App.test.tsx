import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Shanto Systems Studio', () => {
  it('renders the hero and changes paired day/night state', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: /intelligence/i })).toBeVisible()
    const switchButton = screen.getByRole('button', { name: /switch to day mode/i })
    await user.click(switchButton)
    expect(document.querySelector('.site-shell')).toHaveAttribute('data-theme-mode', 'day')
    expect(screen.getByRole('button', { name: /switch to night mode/i })).toBeVisible()
  })

  it('supports the workflow and systems controls', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /plan/i })[1])
    expect(screen.getByRole('heading', { name: /reason over context/i })).toBeVisible()

    await user.click(screen.getByRole('group', { name: 'System filters' }).querySelectorAll('button')[2])
    const systems = screen.getByLabelText('Interactive systems nodes')
    await user.click(within(systems).getByRole('button', { name: /XSIAM/i }))
    expect(screen.getByRole('heading', { name: 'XSIAM' })).toBeVisible()
  })

  it('updates the motion lab and reduced motion toggle', async () => {
    const user = userEvent.setup()
    render(<App />)

    const density = screen.getByRole('slider', { name: 'Motion density' })
    fireEvent.change(density, { target: { value: '82' } })
    expect(screen.getByLabelText('Motion density value')).toHaveTextContent('82')

    await user.click(screen.getByLabelText('Use reduced motion'))
    expect(document.querySelector('.site-shell')).toHaveAttribute('data-reduced-motion', 'true')

    await user.click(screen.getByRole('button', { name: /reset motion settings/i }))
    expect(screen.getByLabelText('Motion density value')).toHaveTextContent('68')
  })
})
