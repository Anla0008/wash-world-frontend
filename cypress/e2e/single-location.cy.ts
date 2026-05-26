// Tester at brugeren kan åbne detaljesiden for en specifik vaskehal
describe("Single location flow", () => {
  it("can open a single car wash location", () => {
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
    // Her hentes alle vaskehaller fra den rigtige backend og database
    cy.intercept("GET", "http://127.0.0.1/locations").as("getLocations");

    // Besøger siden med oversigten over vaskehaller
    cy.visit("/locations");

    // Venter på at backend har svaret med lokationer
    cy.wait("@getLocations").its("response.statusCode").should("eq", 200);

    // Klikker på den første "Læs mere" knap
    // Det åbner detaljesiden for den valgte vaskehal
    cy.contains("Læs mere", { timeout: 10000 }).first().click();

    // Tjekker at brugeren nu er på en dynamisk single location route
    cy.url().should("include", "/locations/");

    // Tjekker at centrale elementer på single location siden bliver vist
    cy.contains("Find vej", { timeout: 10000 }).should("exist");

    // Tjekker at praktisk info sektionen bliver vist
    cy.contains("Praktisk info").should("exist");

    // Tjekker at beskrivende tekst om vaskehallen bliver vist
    cy.contains("Bilvask").should("exist");
  });
});
