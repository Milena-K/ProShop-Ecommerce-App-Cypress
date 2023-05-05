describe("testing the products route", () => {

  beforeEach(() => {
    cy.exec("npm run data:destroy && npm run data:import");
  })

  it("loads the products", () => {
    cy.intercept("/api/products/top").as("carouselProducts");
    cy.intercept("/api/products*").as("firstPageProducts");
    cy.visit("/");

    cy.wait("@carouselProducts").then((r) => {
      cy.wrap(r.response.body).should("have.length", 3);
      Cypress._.map(r.response.body, (product) => {
        cy.wrap(product).should('have.keys', ['__v', '_id', 'brand', 'category', 'countInStock', 'createdAt', 'description', 'image', 'name', 'numReviews', 'price', 'rating', 'reviews', 'updatedAt', 'user']);
      })
    })
    // successfuly received from the api
    cy.wait("@firstPageProducts").then((r) => {
      cy.wrap(r.response.body.products).should("have.length", 6);
      Cypress._.map(r.response.body.products, (product) => {
        cy.wrap(product).should('have.keys', ['__v', '_id', 'brand', 'category', 'countInStock', 'createdAt', 'description', 'image', 'name', 'numReviews', 'price', 'rating', 'reviews', 'updatedAt', 'user']);
      })
    })

    cy.getByDataCy("product-item-carousel").should("have.length", 3);
    // successfuly rendered on the ui
    cy.getByDataCy("product-item").should("have.length", 6);
  })

  it("shows the product page", () => {
    cy.intercept("api/products?*").as("productsTop");
    cy.visit("/");
    cy.wait("@productsTop").then(() => {
      cy.intercept("/api/products").as("productInfo");
      cy.getByDataCy("product-item").last().click();
    })
    cy.wait("@productInfo").then((r) => {
      cy.url().should("include", r.response.body._id);
      cy.get("h2").contains(r.response.body.name);
    })
  })

  it("(admin) deletes a product", () => {
    cy.intercept("/api/products?*").as("loadProducts");
    cy.login("admin@example.com", "123456");
    cy.wait("@loadProducts");

    cy.intercept("/admin/productlist").as("adminProductList");
    cy.visit("/admin/productlist");
    cy.intercept("/api/products?*").as("loadProducts");

    cy.wait("@adminProductList");
    cy.wait("@loadProducts");
    cy.getByDataCy("delete-product").should("have.length", 6);
    cy.getByDataCy("delete-product").last().click();
    cy.getByDataCy("delete-product").should("have.length", 5);
  })

  /*
   * the way this app is built,
   * after clicking the create button
   * a post request is sent to create a new product with dummy values
   * and then an edit screen is loaded
   * so you can edit the newly created product
   * so this test creates and updates the new product with the values we want
   */
  it("(admin) adds a new product", () => {
    const product = {
        "name": "Logitech G-Series Gaming Mouse TEST",
        "image": "/images/mouse.jpg",
        "brand": "Logitech",
        "category": "Electronics",
        "description": "TEST",
        "price": 449.99,
        "countInStock": 5,
    }

    cy.intercept("/api/products*").as("homePage");
    cy.login("admin@example.com", "123456");
    cy.wait("@homePage");

    cy.intercept("/api/products*").as("loadProducts");
    cy.visit("/admin/productList");
    cy.wait("@loadProducts")

    cy.intercept("/api/products").as("newProduct");
    cy.getByDataCy("create-product").click();
    cy.wait("@newProduct").its("response").its("statusCode").should("equal", 201);

    cy.getByDataCy("edit-product-name").type('{selectall}{backspace}' + product.name);
    cy.getByDataCy("edit-product-price").type('{selectall}{backspace}' + product.price);
    cy.getByDataCy("edit-product-image").type('{selectall}{backspace}' + product.image);
    cy.getByDataCy("edit-product-brand").type('{selectall}{backspace}' + product.brand);
    cy.getByDataCy("edit-product-stock").type('{selectall}{backspace}' + product.countInStock);
    cy.getByDataCy("edit-product-category").type('{selectall}{backspace}' + product.category);
    cy.getByDataCy("edit-product-description").type('{selectall}{backspace}' + product.description);
    cy.getByDataCy("edit-product-submit").click();
  })

  it("writes a review for the product", () => {
    const product_rating = "1 - Poor";
    const product_comment = "TEST comment";
    const user_name = "ALi Ahmad";

    cy.intercept("POST", "/api/users/login").as("login");
    cy.login("ali@example.com", "123456");
    cy.getByDataCy("product-item").last().click();
    cy.url().should("contain", "/product/");
    cy.intercept("POST", "/api/products/**/reviews").as("submitReview");
    cy.intercept("GET", "/api/products/*").as("getReview");
    cy.getByDataCy("product-review-rating").select(product_rating);
    cy.getByDataCy("product-review-comment").type(product_comment);
    cy.getByDataCy("submit-product-review").click();
    cy.wait("@submitReview");
    cy.wait("@getReview");
    cy.getByDataCy("product-review")
      .contains(product_comment)
      .siblings("div.rating").as("stars");
    cy.get("@stars").find("i.fas").should("have.length", 1);
    cy.get("@stars").find("i.far").should("have.length", 4);
    cy.getByDataCy("product-review")
      .contains(user_name);



  })

})
