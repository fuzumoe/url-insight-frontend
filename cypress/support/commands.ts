/// <reference types="cypress" />
// Helper function for getting elements by test ID
function getByTestId(testId: string) {
  return cy.get(`[data-testid="${testId}"]`);
}

// Export for use in tests
export { getByTestId };
