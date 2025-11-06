// This is our first test file!

// 'describe' groups our tests together
describe('Application Navigation', () => {
  
  // Test 1: Can we load the home page?
  it('TC-Home: should load the homepage successfully', () => {
    // 1. Visit the root of our site
    cy.visit('/');
    
    // 2. Assert (check) that the page contains our welcome text
    cy.contains('Welcome to the AI Quiz Platform');
    
    // 3. Assert that the "Log In" button is visible
    cy.get('a[href="/login"]').should('be.visible');
  });

  // Test 2: This is TC-002 from our Test Plan
  it('TC-002: should redirect unauthenticated users from dashboard to login', () => {
    // 1. Try to visit the protected dashboard
    cy.visit('/dashboard');
    
    // 2. Assert that we were redirected
    cy.url().should('include', '/login');
    
    // 3. Assert that we see the Clerk login form
    // We wait for an <h1> element that contains the text "Sign in".
    cy.get('h1', { timeout: 10000 }).contains('Sign in');
  });

  // --- NEW TESTS ADDED BELOW ---

  // Test 3: Can we load the login page directly?
  it('TC-Nav-Login: should load the login page directly', () => {
    // 1. Visit the login page
    cy.visit('/login');

    // 2. Assert that we see the Clerk login form
    cy.get('h1', { timeout: 10000 }).contains('Sign in');
  });

  // Test 4: Can we load the sign-up page directly?
  it('TC-Nav-Signup: should load the sign-up page directly', () => {
    // 1. Visit the sign-up page
    cy.visit('/signup');

    // 2. Assert that we see the Clerk sign-up form
    // Note: The text is different for this page
    cy.get('h1', { timeout: 10000 }).contains('Create your account');
  });

});
