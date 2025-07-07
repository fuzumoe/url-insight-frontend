describe('App E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the homepage', () => {
        cy.contains('Learn React');
        cy.get('.App-header').should('be.visible');
    });

    it('should have correct page title', () => {
        cy.title().should('eq', 'React App');
    });

    it('should contain the React logo', () => {
        cy.get('.App-logo').should('be.visible');
    });

    it('should have working navigation', () => {
        // Add navigation tests based on your app structure
        cy.get('body').should('contain', 'Learn React');
    });
});
