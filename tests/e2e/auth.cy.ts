describe('authentication flow', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })
    cy.visit('/')
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })
  })

  describe('registration', () => {
    it('should display registration form', () => {
      cy.visit('/register')
      cy.get('[data-testid="register-title"]').should('be.visible')
      cy.get('[data-testid="name-field"]').should('be.visible')
      cy.get('[data-testid="email-field"]').should('be.visible')
      cy.get('[data-testid="password-field"]').should('be.visible')
      cy.get('[data-testid="confirm-password-field"]').should('be.visible')
      cy.get('[data-testid="submit-button"]').should('be.visible')
    })

    it('should show validation errors for invalid inputs', () => {
      cy.visit('/register')
      cy.get('[data-testid="submit-button"]').click()
    })

    it('should show error for password mismatch', () => {
      cy.visit('/register')
      cy.get('[data-testid="name-field"] input').type('Test User')
      cy.get('[data-testid="email-field"] input').type('test@example.com')
      cy.get('[data-testid="password-field"] input').type('password123')
      cy.get('[data-testid="confirm-password-field"] input').type('different123')
      cy.get('[data-testid="submit-button"]').click()
    })
  })

  describe('login', () => {
    it('should display login form', () => {
      cy.visit('/login')
      cy.get('[data-testid="login-title"]').should('be.visible')
      cy.get('[data-testid="email-field"]').should('be.visible')
      cy.get('[data-testid="password-field"]').should('be.visible')
      cy.get('[data-testid="submit-button"]').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      cy.get('[data-testid="submit-button"]').click()
    })

    it('should redirect to register from login', () => {
      cy.visit('/login')
      cy.get('[data-testid="register-link"]').click()
      cy.url().should('include', '/register')
    })
  })

  describe('navigation guards', () => {
    it('should redirect unauthenticated users to register', () => {
      cy.visit('/home')
      cy.url().should('include', '/register')
    })

    it('should redirect unauthenticated users from protected routes', () => {
      cy.visit('/integrations')
      cy.url().should('include', '/register')

      cy.visit('/profile')
      cy.url().should('include', '/register')

      cy.visit('/analysis')
      cy.url().should('include', '/register')
    })
  })
})
