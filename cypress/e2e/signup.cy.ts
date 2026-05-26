// Tester at en ny bruger kan oprettes gennem sign up flowet
describe("Sign up flow", () => {
  it("can create a new user", () => {
    // Laver unikke testdata, så testen kan køres flere gange
    // Email og nummerplade skal være unikke, fordi de gemmes i databasen
    const timestamp = Date.now();
    const email = `cypress-${timestamp}@test.dk`;
    const plateNumber = `CY${String(timestamp).slice(-5)}`;

    // Holder øje med requestet der tjekker om emailen allerede findes
    cy.intercept("POST", "http://127.0.0.1/check-email").as("checkEmail");

    // Holder øje med requestet der opretter brugeren i databasen
    cy.intercept("POST", "http://127.0.0.1/sign-up").as("signUp");

    // Besøger sign up siden
    cy.visit("/sign-up");

    // Udfylder step 1 i oprettelsesformularen
    cy.get('input[type="email"]').type(email);
    cy.get('input[placeholder="Anders"]').type("Cypress");
    cy.get('input[placeholder="Andersen"]').type("Test");
    cy.get('input[type="password"]').first().type("password");
    cy.get('input[type="password"]').last().type("password");
    cy.get('input[placeholder="AB12345"]').type(plateNumber);

    // Går videre fra step 1 til step 2
    // Her tjekker frontend først med backend, om emailen er ledig
    cy.contains("button", "Gå videre").click();

    // Venter på at backend har tjekket emailen
    cy.wait("@checkEmail").its("response.statusCode").should("eq", 200);

    // Tjekker at brugeren er kommet videre til step 2
    cy.contains("Kortoplysninger", { timeout: 10000 }).should("be.visible");

    // Klikker på "Opret bruger"
    cy.contains("button", "Opret bruger").click();

    // Venter på at backend opretter brugeren
    cy.wait("@signUp").its("response.statusCode").should("be.oneOf", [200, 201]);

    // Tjekker at brugeren kommer til step 3, hvor email verificering vises
    cy.contains("Verificer din e-mail", { timeout: 10000 }).should("be.visible");

    // Tjekker at den nye brugers email vises i verificeringsbeskeden
    cy.contains(email).should("be.visible");
  });
});
