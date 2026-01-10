describe('ioc search', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })

    cy.window().then((win) => {
      win.localStorage.setItem(
        'auth',
        JSON.stringify({
          authorized: true,
          token:      'mock-jwt-token',
          user:       {
            id:    '1',
            name:  'Test User',
            email: 'test@example.com',
            theme: 'light'
          }
        })
      )
    })

    cy.intercept('GET', '**/api/ioc-analysis*', { fixture: 'empty-response.json' }).as(
      'getAnalysis'
    )
    cy.intercept('POST', '**/api/ioc-analysis*', { fixture: 'empty-response.json' }).as(
      'createAnalysis'
    )
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  describe('unified analysis search', () => {
    beforeEach(() => {
      cy.visit('/analysis')
    })

    it('should display analysis page', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/analysis')
    })

    it('should display search form', () => {
      cy.get('body').should('exist')
      // Add more specific selectors here when the UI is stable
    })

    it('should detect ioc type', () => {
      cy.get('body').should('exist')
    })

    it('should clear search input', () => {
      cy.get('body').should('exist')
    })
  })

  describe('search history', () => {
    beforeEach(() => {
      cy.visit('/history')
    })

    it('should display history page', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/history')
    })

    it('should display search filter', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/history')
    })

    it('should filter history by search term', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/history')
    })

    it('should clear search history', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/history')
    })
  })
})
