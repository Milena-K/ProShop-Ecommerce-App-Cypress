describe("User Sign-up and Login", () => {
  beforeEach(() => {
    // cy.exec("npm run data:destroy");
    // cy.exec("npm run data:import");
    cy.visit("/login");
  })

  it("should log in", () => {
    cy.login("ali@example.com", "123456");
    cy.visit("/profile")
  })

  it("should show an error for invalid user", () => {
    cy.login("fake@user.com", "fakePa$$")
    cy.contains("Invaild email and password")
})
