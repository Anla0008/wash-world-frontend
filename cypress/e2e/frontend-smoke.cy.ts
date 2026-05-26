describe("Frontend smoke test", () => {
  it("can open the login page", () => {
    cy.visit("/");

    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");

    cy.contains("Har du ikke en konto?").should("exist");
    cy.contains("Opret bruger").should("exist");
  });
});
