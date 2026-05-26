// Tester login flowet og at brugeren lander på dashboard efter korrekt login
describe("Login flow", () => {
  it("can login with a real user and go to dashboard", () => {
    // Besøger forsiden, hvor login formularen ligger
    cy.visit("/");

    // Indtaster email og password fra en rigtig bruger i databasen
    cy.get('input[type="email"]').type("anla0008@stud.ek.dk");
    cy.get('input[type="password"]').type("password");

    // Klikker på login knappen og sender formularen
    cy.contains("button", "Login").click();

    // Tjekker at brugeren bliver sendt videre til dashboard efter login
    cy.url().should("include", "/dashboard");

    // Tjekker at dashboardet viser en hilsen til brugeren
    cy.contains("Hej").should("be.visible");

    // Tjekker at login har gemt nødvendige brugerdata i localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.exist;
      expect(win.localStorage.getItem("user_first_name")).to.exist;
      expect(win.localStorage.getItem("user_email")).to.exist;
    });
  });
});
