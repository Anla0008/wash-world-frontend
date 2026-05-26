// Tester at brugeren kan tilføje eller fjerne en vaskehal som favorit
describe("Favorites flow", () => {
  it("can toggle a car wash location as favorite", () => {
    // Besøger forsiden, hvor login formularen ligger
    cy.visit("/");

    // Indtaster email og password fra en rigtig bruger i databasen
    cy.get('input[type="email"]').type("anla0008@stud.ek.dk");
    cy.get('input[type="password"]').type("password");

    // Sender login formularen
    cy.contains("button", "Login").click();

    // Sikrer at login lykkes, og brugeren bliver sendt til dashboard
    cy.url().should("include", "/dashboard");

    // Holder øje med requestet der henter alle vaskehaller
    cy.intercept("GET", "http://127.0.0.1/locations").as("getLocations");

    // Holder øje med requestet der henter brugerens favoritter
    // Favoritter er brugerspecifikke, fordi frontend sender JWT token med til backend
    cy.intercept("GET", "http://127.0.0.1/favorites").as("getFavorites");

    // Holder øje med requestet der opretter en ny favorit i databasen
    cy.intercept("POST", "http://127.0.0.1/favorites").as("addFavorite");

    // Holder øje med requestet der fjerner en favorit fra databasen
    cy.intercept("DELETE", "http://127.0.0.1/favorites/*").as("removeFavorite");

    // Besøger siden med oversigten over vaskehaller
    cy.visit("/locations");

    // Venter på at backend har svaret med alle lokationer
    cy.wait("@getLocations").its("response.statusCode").should("eq", 200);

    // Venter på at backend har svaret med brugerens favoritter
    cy.wait("@getFavorites").its("response.statusCode").should("eq", 200);

    // Tjekker om der findes en knap til at tilføje en favorit
    cy.get("body").then(($body) => {
      if ($body.find('[aria-label="Tilføj til favoritter"]').length > 0) {
        // Hvis lokationen ikke allerede er favorit, klikker vi på "Tilføj til favoritter"
        cy.get('[aria-label="Tilføj til favoritter"]').first().click();

        // Venter på at backend opretter favoritten
        cy.wait("@addFavorite").its("response.statusCode").should("eq", 201);

        // Tjekker at UI'et nu viser knappen som "Fjern fra favoritter"
        cy.get('[aria-label="Fjern fra favoritter"]').first().should("exist");
      } else {
        // Hvis lokationen allerede er favorit, klikker vi i stedet på "Fjern fra favoritter"
        cy.get('[aria-label="Fjern fra favoritter"]').first().click();

        // Venter på at backend fjerner favoritten
        cy.wait("@removeFavorite").its("response.statusCode").should("eq", 200);

        // Tjekker at UI'et nu viser knappen som "Tilføj til favoritter"
        cy.get('[aria-label="Tilføj til favoritter"]').first().should("exist");
      }
    });
  });
});
