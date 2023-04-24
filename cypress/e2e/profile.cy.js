describe("testing private profile page", () => {
  beforeEach(() => {
    cy.exec("npm run data:destroy && npm run data:import");
  })

  it("should display the profile page of the current user", () => {
    const user_email = "ali@example.com";
    const user_password = "123456";

    cy.intercept("POST", "/api/users/login").as("loginUser");
    cy.login(user_email, user_password);
    cy.intercept("GET", "/api/users/profile").as("profileUser");

    cy.wait("@loginUser");
    cy.visit("/profile");
    cy.wait("@profileUser").then((response) => {
      expect(response.response.statusCode).to.be.oneOf([200, 304]);
    })
  })

  it("should redirect not logged in user from profile to login page", () => {
    cy.visit("profile");
    cy.url().should("include", "/login");
  })

  it("should update profile info", () => {
    const user_email = "ali@example.com";
    const user_password = "123456";

    cy.intercept("POST", "/api/users/login").as("loginUser");
    cy.login(user_email, user_password);
    cy.wait("@loginUser");

    cy.intercept("GET", "/api/users/profile").as("getProfile");
    cy.intercept("PUT", "/api/users/profile").as("updateProfile");
    cy.visit("/profile");
    cy.wait("@getProfile");

    // get the exposed redux store
    cy.window().its("store").invoke("getState").then((state) =>{
      let user_name = state.userLogin.userInfo.name;
      cy.getByDataCy("profile-name").clear().type(user_name + "i");
    });

    cy.getByDataCy("update-profile").click();
    cy.wait("@updateProfile").then((response) => {
      expect(response.response.statusCode).to.be.equal(200);
    })
  })
})
