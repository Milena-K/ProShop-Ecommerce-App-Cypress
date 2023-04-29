describe("testing the products route", () => {

  beforeEach(() => {
    cy.exec("npm run data:destroy && npm run data:import");
  })

  // it("loads the products", () => {
  //   cy.intercept("/api/products/top").as("carouselProducts");
  //   cy.intercept("/api/products*").as("firstPageProducts");
  //   cy.visit("/");

  //   cy.wait("@carouselProducts").then((r) => {
  //     cy.wrap(r.response.body).should("have.length", 3);
  //     Cypress._.map(r.response.body, (product) => {
  //       cy.wrap(product).should('have.keys', ['__v', '_id', 'brand', 'category', 'countInStock', 'createdAt', 'description', 'image', 'name', 'numReviews', 'price', 'rating', 'reviews', 'updatedAt', 'user']);
  //     })
  //   })
  //   // successfuly received from the api
  //   cy.wait("@firstPageProducts").then((r) => {
  //     cy.wrap(r.response.body.products).should("have.length", 6);
  //     Cypress._.map(r.response.body.products, (product) => {
  //       cy.wrap(product).should('have.keys', ['__v', '_id', 'brand', 'category', 'countInStock', 'createdAt', 'description', 'image', 'name', 'numReviews', 'price', 'rating', 'reviews', 'updatedAt', 'user']);
  //     })
  //   })

  //   cy.getByDataCy("product-item-carousel").should("have.length", 3);
  //   // successfuly rendered on the ui
  //   cy.getByDataCy("product-item").should("have.length", 6);
  // })

  // it("shows the product page", () => {
  //   cy.intercept("api/products/top").as("productsTop");
  //   cy.visit("/");
  //   cy.wait("@productsTop").then(() => {
  //     cy.intercept("api/products/*").as("productInfo");
  //     cy.getByDataCy("product-item").last().click();
  //   })
  //   cy.wait("@productInfo").then((r) => {
  //     cy.url().should("include", r.response.body._id);
  //     cy.get("h2").contains(r.response.body.name);
  //   })
  // })

  // it("(admin) deletes a product", () => {
  //   cy.intercept("/api/products/*").as("login");
  //   cy.login("admin@example.com", "123456");
  //   cy.wait("@login");
  //   cy.visit("/admin/productlist").then(() => {
  //     cy.getByDataCy("delete-product").should("have.length", 6);
  //     cy.getByDataCy("delete-product").last().click();
  //     cy.getByDataCy("delete-product").should("have.length", 5);
  //   });
  // })

  it("(admin) adds a new product", () => {
    const product = {
        "name": "Logitech G-Series Gaming Mouse TEST",
        "image": "/images/mouse.jpg",
        "brand": "Logitech",
        "category": "Electronics",
        "description": "Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience",
        "price": 449.99,
        "countInStock": 5,
    }

    // cy.intercept("/api/users/login").as("login");
    cy.intercept("/").as("homePage");
    // cy.login("admin@example.com", "123456");
    cy.request({
      method: "POST",
      url: "/api/users/login",
      body: {
        email: "admin@example.com",
        password: "123456",
      }
    });
    cy.visit("/");


    cy.intercept("POST","/api/products").as("postProduct");
    cy.wait("@homePage").then((r) => {
      // cy.wait("@homePage")
        const token = r
      console.log(token)

        cy.request({
            method: "POST",
            url: "/api/products",
            auth: {
                bearer: { token }
            },
            body: { product },
        })

        cy.wait("@postProduct");
        cy.request({
            url: "/api/products",
            auth: {
                bearer: { token }
            }}).as("getProducts");
    });
    // cy.wait("@getProducts").then((r) => {
    //     const products = r.body.products;
    //     cy.wrap(products).last().its("name").should("contain", "TEST")
    // })


  })

})
