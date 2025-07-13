/// <reference types="cypress" />

describe('App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('Vite + React');
  });

  it('should have correct page title', () => {
    cy.title().should('eq', 'Vite + React + TS');
  });

  it('should contain the Vite and React logos', () => {
    cy.get('img[alt="Vite logo"]').should('be.visible');
    cy.get('img[alt="React logo"]').should('be.visible');
  });

  it('should have a working counter', () => {
    cy.contains('count is 0').should('exist');
    cy.contains('button', 'count is 0').click();
    cy.contains('count is 1').should('exist');
  });
});
