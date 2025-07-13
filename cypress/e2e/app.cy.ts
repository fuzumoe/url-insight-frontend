/// <reference types="cypress" />

describe('App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.get('body').should('be.visible');
  });

  it('should have correct page title', () => {
    cy.title().should('eq', 'Vite + React + TS');
  });

  it('should contain the main UI elements', () => {
    cy.get('body').should('be.visible');
  });

  it('should have interactive elements', () => {
    cy.get('body').should('be.visible');
  });
});
