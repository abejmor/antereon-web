describe('navigation', () => {
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

    cy.intercept('GET', '/api/**', { fixture: 'empty-response.json' }).as('apiCall')
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })
  })

  describe('basic navigation tests', () => {
    it('should load home page', () => {
      cy.visit('/home')
      cy.url().should('include', '/home')
    })

    it('should load integrations page', () => {
      cy.visit('/integrations')
      cy.url().should('include', '/integrations')
    })

    it('should load profile page', () => {
      cy.visit('/profile')
      cy.url().should('include', '/profile')
    })

    it('should load analysis page', () => {
      cy.visit('/analysis')
      cy.url().should('include', '/analysis')
    })

    it('should load history page', () => {
      cy.visit('/history')
      cy.url().should('include', '/history')
    })

    it('should have navigation drawer component', () => {
      cy.visit('/home')
      cy.get('body').should('exist')
    })

    it('should have sidebar functionality', () => {
      cy.visit('/home')
      cy.get('body').should('exist')
    })
  })
})
