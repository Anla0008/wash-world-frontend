// Tester at brugeren ikke kan logge ind med forkerte oplysninger
describe("Login error flow", () => {
  it("does not login with wrong credentials", () => {
    // Besøger forsiden, hvor login formularen ligger
    cy.visit("/");

    // Indtaster login oplysninger, som ikke matcher en gyldig bruger i databasen
    cy.get('input[type="email"]').type("wrong@test.dk");
    cy.get('input[type="password"]').type("forkertkode");

    // Forsøger at logge ind
    cy.contains("button", "Login").click();

    // Tjekker at brugeren IKKE bliver sendt videre til dashboard
    cy.url().should("not.include", "/dashboard");

    // Tjekker at login formularen stadig er synlig
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");

    // Tjekker at der ikke bliver gemt et token i localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
    });
  });
});
