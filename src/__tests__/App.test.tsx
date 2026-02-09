import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import Loader from '../components/ui/Loader';

test('renders Loader component with default text', () => {
  render(
    <ThemeProvider>
      <Loader />
    </ThemeProvider>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('renders Loader component with custom text', () => {
  render(
    <ThemeProvider>
      <Loader text="Please wait" />
    </ThemeProvider>
  );
  expect(screen.getByText('Please wait')).toBeInTheDocument();
});
