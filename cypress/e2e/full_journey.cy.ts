describe('Full User Journey (Sign-Up, Create, Take, and Delete Quiz)', () => {

  

  // This single test covers TC-001, TC-003, TC-005, and TC-006

  it('should allow a new user to sign up, create, take, and delete a quiz', () => {

    

    // --- 1. SIGN UP (TC-001) ---

    const timestamp = Date.now();

    const userEmail = `test.${timestamp}@example.com`;

    const userPassword = `TestP@ss!${timestamp}`; 

    const quizTitle = `My Cypress Quiz ${timestamp}`; // Make title unique too



    cy.visit('/signup');

    cy.get('h1', { timeout: 10000 }).contains('Create your account');



    // Fill sign-up form

    cy.get('input[name="firstName"]').type('Test');

    cy.get('input[name="lastName"]').type('User');

    cy.get('input[name="emailAddress"]').type(userEmail);

    cy.get('input[name="password"]').type(userPassword);

    cy.contains('button', 'Continue').click();



    // --- 2. LAND ON DASHBOARD ---

    cy.url().should('include', '/dashboard', { timeout: 15000 }); 

    cy.contains('Start Creating');



    // --- 3. CREATE QUIZ (TC-003) ---

    cy.contains('Build Manual Quiz').click();

    cy.url().should('include', '/create-manual');



    // Fill out the manual quiz form

    cy.get('input[id="title"]').type(quizTitle);

    cy.get('input[id="timer"]').type('10');

    cy.get('textarea[id^="q-text-"]').type('What is 2+2?');

    cy.get('input[id^="q-"][id*="-o-0-text"]').type('4'); // Correct

    cy.get('input[id^="q-"][id*="-o-1-text"]').type('5');

    cy.get('input[id^="q-"][id*="-o-2-text"]').type('6');

    cy.get('input[id^="q-"][id*="-o-3-text"]').type('7');

    cy.get('button[id^="q-"][id*="-o-0"]').click(); // Select '4' as answer

    cy.contains('Save Quiz').click();



    // --- 4. VERIFY CREATION ---

    cy.url().should('include', '/dashboard', { timeout: 10000 });

    cy.contains('Saved Quizzes');

    cy.contains(quizTitle); // The quiz exists!



    // --- 5. TAKE QUIZ (TC-005) ---



    // Find the quiz card we just made and click "Start Quiz"

    // We find the card by its title, go to its parent, then find the link.

    cy.contains(quizTitle)

      .closest('.bg-card\\/60') // Find the parent card

      .find('a[href*="/quiz/"]')  // Find the "Start Quiz" link

      .click();



    // We are on the Quiz Taker page

    cy.url().should('include', '/quiz/');

    cy.contains('Question 1 of 1');

    cy.contains('What is 2+2?');



    // Click the correct answer ('4')

    // In the QuizTaker, we *did* use a <label>

    cy.contains('label', '4').click();



    // Finish the quiz

    cy.contains('button', 'Finish Quiz').click();



    // Check the results page

    cy.contains('Quiz Completed!');

    cy.contains('1 / 1'); // We got a perfect score



    // Go back to the dashboard

    cy.contains('Back to Dashboard').click();

    cy.url().should('include', '/dashboard', { timeout: 10000 });



    // --- 6. DELETE QUIZ (TC-006) ---



    // The quiz card is still there

    cy.contains(quizTitle);



    // Find the delete button on that card and click it

    cy.contains(quizTitle)

      .closest('.bg-card\\/60') // Find the parent card

      .contains('button', 'Delete') // Find button by visible text

      .click();



    // --- 7. VERIFY DELETION ---

    

    // The quiz title should no longer exist on the page

    cy.contains(quizTitle).should('not.exist');

  });



});
