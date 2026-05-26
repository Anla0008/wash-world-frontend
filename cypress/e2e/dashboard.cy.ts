// Tester at brugeren kan logge ind og se dashboardets centrale indhold
describe("Dashboard flow", () => {
  it("can show the dashboard after login", () => {
    // Besøger forsiden, hvor login formularen ligger
    cy.visit("/");

    // Indtaster email og password fra en rigtig bruger i databasen
    cy.get('input[type="email"]').type("anla0008@stud.ek.dk");
    cy.get('input[type="password"]').type("password");

    // Sender login formularen
    cy.contains("button", "Login").click();

    // Sikrer at login lykkes, og brugeren sendes til dashboard
    cy.url().should("include", "/dashboard");

    // Tjekker at dashboardet viser en personlig hilsen
    cy.contains("Hej").should("be.visible");

    // Tjekker at dashboardets centrale sektioner bliver vist
    cy.contains("Abonnementer").should("be.visible");

    // Tjekker at token og brugerdata er gemt efter login
    // Det viser, at brugeren er logget ind og kan bruge beskyttede funktioner
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.exist;
      expect(win.localStorage.getItem("user_first_name")).to.exist;
      expect(win.localStorage.getItem("user_email")).to.exist;
    });
  });
});
