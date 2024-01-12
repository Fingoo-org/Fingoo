import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Page />)
 
    const home = screen.getByText('Home');

    expect(home).toBeInTheDocument()
  })
})