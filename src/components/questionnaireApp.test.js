import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import QuestionnaireApp from "./questionnaireApp.js";

test('renders with questionnaire name as heading', async () => {
  render(<QuestionnaireApp />);
  const linkElement = await screen.getByTestId("header");
  expect(linkElement).toHaveTextContent(/Privathaftpflichtversicherung/i);
});

test('renders with previos button hidden initially', async () => {
    render(<QuestionnaireApp />);
    const previousButton = await screen.getByRole('button', {name: /Previous/i});
    expect(previousButton).toHaveClass('hide-item');
});

test('next button is available at initial render', async () => {
    render(<QuestionnaireApp />);
    const nextButton = await screen.getByRole('button', {name: /Next/i});
    expect(nextButton).not.toHaveClass('hide-item');
});

test('Initial question rendered with 5 input options as per the data', async () => {
    render(<QuestionnaireApp />);
    await waitFor(() => { expect(screen.getAllByTestId("options-selection").length).toBe(5) });
});


