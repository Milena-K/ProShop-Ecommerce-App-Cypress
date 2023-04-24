  // // get the exposed redux store
    // cy.window().its("store").invoke("getState").then((state) =>{
    //   cy.wrap(state)
    //     .its("userLogin")
    //     .its("userInfo")
    //     .its("email").should("equal", email);
    // });

describe("User Sign-up and Login", () => {
  before(() => {
    cy.exec("npm run data:destroy");
    cy.exec("npm run data:import");
  });


  it("logges an existing user in", () => {
    const email = "ali@example.com";
    const pass = "123456";

    cy.intercept("POST", "/api/users/login").as("loginUser");

    cy.login(email, pass);

    cy.wait("@loginUser").then((loginUser) => {
      cy.wrap(loginUser)
        .its("response")
        .its("body")
        .its("email").should("be.equal", email)
    })
  });

  it("registers a new user", () => {
    const name = "Jon Doe";
    const email = "new@user.com";
    const password = "newPa$$";

    cy.intercept("POST", "/api/users").as("registerUser");

    cy.register(name, email, password);

    cy.wait("@registerUser").then((response) => {
      cy.wrap(response)
        .its("response")
        .its("statusCode").should("equal", 201);
    });
  })

  it("doesn't let unregistered user in", () => {
    const email = "fake@user.com";
    const password = "newPa$$";

    cy.intercept("POST", "/api/users/login").as("loginUser");

    cy.login(email, password);

    cy.wait("@loginUser").then((response) => {
      cy.wrap(response).its("response").its("statusCode").should("equal", 401)
    })
  });


})
