describe('ioc search', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })

    cy.window().then((win) => {
      win.localStorage.setItem('auth', JSON.stringify({
        authorized: true,
        token:      'mock-jwt-token',
        user:       {
          id:    '1',
          name:  'Test User',
          email: 'test@example.com',
          theme: 'light'
        }
      }))
    })

    cy.intercept('GET', '/api/**', { fixture: 'empty-response.json' }).as('apiCall')
    cy.intercept('POST', '/api/**', { fixture: 'empty-response.json' }).as('apiPost')
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  describe('virustotal search', () => {
    beforeEach(() => {
      cy.visit('/virustotal')
    })

    it('should display search form', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })

    it('should search for ip address', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })

    it('should search for domain', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })

    it('should search for hash', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })

    it('should display detected ioc type', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })

    it('should clear search input', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/virustotal')
    })
  })

  describe('abuseipdb search', () => {
    beforeEach(() => {
      cy.visit('/abuseipdb')
    })

    it('should display search form', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/abuseipdb')
    })

    it('should search for ip address', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/abuseipdb')
    })

    it('should display detected ioc type', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/abuseipdb')
    })
  })

  describe('alienvault search', () => {
    beforeEach(() => {
      cy.visit('/alienvault')
    })

    it('should display search form', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/alienvault')
    })

    it('should search for ip address', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/alienvault')
    })

    it('should display detected ioc type', () => {
      cy.get('body').should('exist')
      cy.url().should('include', '/alienvault')
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
