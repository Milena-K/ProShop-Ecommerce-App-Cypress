describe("admin users routes are working", () => {
  beforeEach(() => {
    cy.exec("npm run data:destroy && npm run data:import");
    cy.intercept("/login").as("login");
    cy.login("admin@example.com", "123456")
  });

  it("loads profile page", () => {
    cy.intercept('/users').as("profileAsAdmin");
    cy.visit("/users");
    cy.wait("@profileAsAdmin").then((req) => {
        expect(req.response.statusCode).to.be.equal(200);
    });
  })

  it("get's every user in db", () => {
    cy.intercept("/admin/userlist").as("adminUsers");
    cy.visit("/admin/userlist")

    cy.wait("@adminUsers");
    cy.getByDataCy("users-table-body").children().should("have.length", 3);
  })

  it("deletes a user", () => {
    cy.wait("@login").then(() => {
        cy.intercept("/admin/userlist").as("adminUsers");
        cy.visit("/admin/userlist");
        cy.wait("@adminUsers");

        cy.intercept("DELETE", "/api/users/*").as("deleteUser");
        cy.getByDataCy("delete-user").last().click()

        cy.wait("@deleteUser").then((req) => {
            expect(req.response.statusCode).to.be.equal(200);
        })
    })


  })

  it("get's and edits a user", () => {
    cy.wait("@login").then(() => {
        cy.intercept("/admin/userlist").as("adminUsers");
        cy.visit("/admin/userlist");
        cy.wait("@adminUsers").then(() => {
            cy.intercept(`api/users/**/*`).as("userDetails")
            cy.getByDataCy("edit-user").last().click()
        })

        cy.intercept("PUT", "/api/users/**").as("updateDetails");
        cy.wait("@userDetails").then((req) => {
            expect(req.response.statusCode).to.be.equal(200);
            cy.get("form").getByDataCy("user-name").type("ov");
            cy.getByDataCy("update-btn").click()
        });

        cy.wait("@updateDetails").then((req) => {
            expect(req.response.statusCode).to.be.equal(200);
        })
    });

  })

})
