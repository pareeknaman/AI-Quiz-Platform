describe('Full AI User Journey (Sign-Up and AI Quiz Creation)', () => {

  

  // This single test covers TC-001 and TC-004

  it('TC-001 & TC-004: should allow a new user to sign up, create with AI, and see the quiz', () => {

    

    // --- 1. SIGN UP (TC-001) ---

    const timestamp = Date.now();

    const userEmail = `test.ai.${timestamp}@example.com`; // Unique email

    const userPassword = `TestP@ss!${timestamp}`; // Unique password



    cy.visit('/signup');

    cy.get('h1', { timeout: 10000 }).contains('Create your account');



    // Fill sign-up form

    cy.get('input[name="firstName"]').type('AI Test');

    cy.get('input[name="lastName"]').type('User');

    cy.get('input[name="emailAddress"]').type(userEmail);

    cy.get('input[name="password"]').type(userPassword);

    cy.contains('button', 'Continue').click();



    // --- 2. LAND ON DASHBOARD ---

    cy.url().should('include', '/dashboard', { timeout: 15000 }); 

    cy.contains('Start Creating');



    // --- 3. CREATE AI QUIZ (TC-004) ---

    cy.contains('Generate AI Quiz').click(); // Click the AI button

    cy.url().should('include', '/create-quiz');



    // Fill out the AI quiz form

    cy.get('input[id="topic"]').type('The Solar System');

    cy.get('input[id="num-questions"]').clear().type('3'); // Fix from last time

    

    // Click "Generate Quiz"

    cy.contains('Generate Quiz with AI').click();



    // --- 4. REVIEW AI QUIZ ---

    

    // Wait up to 30 seconds for the "Review" text to appear.

    cy.contains('Review Your Quiz', { timeout: 30000 });



    // Verify that 3 questions were generated

    cy.get('.bg-card\\/80').should('have.length', 3);



    // --- THIS IS THE FIX ---

    // We tell Cypress to scroll the "Save" button into view before clicking.

    cy.contains('Save This Quiz').scrollIntoView().click();

    // --- END OF FIX ---



    // --- 5. VERIFY ON DASHBOARD ---

    cy.url().should('include', '/dashboard', { timeout: 10000 });

    cy.contains('Saved Quizzes');



    // Verify the 3-question quiz exists.

    cy.contains('.text-sm.text-muted-foreground', '3 Questions');



    // --- 6. CLEAN UP (DELETE QUIZ) ---



    // Find the delete button on that card and click it

    cy.contains('.text-sm.text-muted-foreground', '3 Questions')

      .closest('.bg-card\\/60') // Find the parent card

      .find('button[variant="destructive"]') // Find the "Delete" button

      .click();



    // Verify it's gone

    cy.contains('.text-sm.text-muted-foreground', '3 Questions').should('not.exist');

  });



});
