// Tester at brugeren kan logge ind og se vaskehaller hentet fra backend
describe("Find car wash flow", () => {
  it("can show car wash locations from the backend after login", () => {
    // Besøger forsiden, hvor login formularen ligger
    cy.visit("/");

    // Indtaster email og password fra en rigtig bruger i databasen
    cy.get('input[type="email"]').type("anla0008@stud.ek.dk");
    cy.get('input[type="password"]').type("password");

    // Sender login formularen
    cy.contains("button", "Login").click();

    // Sikrer at login lykkes, og brugeren bliver sendt til dashboard
    cy.url().should("include", "/dashboard");

    // Holder øje med GET requestet til backendens locations endpoint
    // Her mocker vi ikke data, vi observerer bare det rigtige request
    cy.intercept("GET", "http://127.0.0.1/locations").as("getLocations");

    // Besøger siden, hvor vaskehallerne vises
    cy.visit("/locations");

    // Venter på at backend har svaret med lokationer
    cy.wait("@getLocations").its("response.statusCode").should("eq", 200);

    // Tjekker at mindst én vaskehal bliver vist i UI'et
    // "Vis vej" findes på vaskehal kortene, så det indikerer at data er rendered
    cy.contains("Vis vej", { timeout: 10000 }).should("exist");
  });
});
