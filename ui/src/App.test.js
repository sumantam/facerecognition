import { render } from '@testing-library/react';
import App from './App';

describe(App, () => {
  it("App has toast container", () => {
    const { container } = render(<App />);
    expect(container.firstChild.classList.contains('Toastify')).toBe(true);
  });
});

