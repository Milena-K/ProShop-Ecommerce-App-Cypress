import { payOrder } from "../../frontend/src/actions/orderActions";

describe("CRUD operations on route /orders", () => {
  before(() => {
    cy.exec("npm run data:destroy && npm run data:import");
  })

  it("should make an order", () => {
    const email = "ali@example.com";
    const password = "123456";
    const user_name = "ALi Ahmad";

    cy.intercept("/api/products/*").as("homePage");
    cy.login(email, password);
    const order_details = {
      addr: "Fake Str.",
      city: "Skopje",
      postal_code: "1000",
      country: "Macedonia",
    }
    cy.wait("@homePage");
    cy.getByDataCy("product-item").first().click();
    cy.url().should("contain", "/product/");
    cy.getByDataCy("order-quantity").select("2");
    cy.getByDataCy("order-button").click();
    cy.url().should("contain", "/cart/");
    cy.getByDataCy("proceed-to-checkout").click();
    cy.getByDataCy("shipping-address").type(order_details.addr);
    cy.getByDataCy("shipping-city").type(order_details.city);
    cy.getByDataCy("shipping-postal-code").type(order_details.postal_code);
    cy.getByDataCy("shipping-country").type(order_details.country);
    cy.getByDataCy("order-submit").click();
    cy.getByDataCy("continue-payment").click();
    cy.getByDataCy("place-order-button").click();

    cy.intercept("PUT", `/api/orders/**/pay`).as("hihi");

    cy.window().its("store").invoke("getState").then((state) => {
      const order = state.orderCreate.order;
      // using a fake payment result so i don't interact with
      // third party iframe such as paypal
      const paymentResult = {
        id: "123",
        status: "payed dw",
        update_time: "11.1.1",
        payer: {
          email_address: "not@fake.com"
        }
      }
      const dispatchResult = payOrder(order._id, paymentResult);
      cy.window().its("store").invoke("dispatch", dispatchResult)
    })
    cy.wait("@hihi").then((r) => {
      cy.wrap(r.response).its("statusCode").should("equal", 200);
    })
    cy.get("div.alert-success").contains("Paid on");

    const address = order_details.addr + ', '
          + order_details.city + ' '
          + order_details.postal_code + ', '
          + order_details.country
    cy.getByDataCy("order-shipping-info")
      .should("contain", user_name)
      .should("contain", email)
      .should("contain", address)
  })

  it("delivers an order", () => {
    const email = "admin@example.com";
    const password = "123456";
    cy.login(email, password);
    cy.getByDataCy("dropdown-admin").click();
    cy.getByDataCy("admin-orderlist").click();
    cy.getByDataCy("td-order-delivered").get("i.fas.fa-times");
    cy.getByDataCy("btn-order-details").click();
    cy.url().should("contain", "/order/");
    cy.getByDataCy("order-shipping-info").contains("Not Delivered");
    cy.intercept("PUT","/api/orders/**/deliver").as("deliverOrder");
    cy.getByDataCy("btn-mark-delivered").click();
    cy.wait("@deliverOrder").then((r) => {
      cy.wrap(r.response.statusCode).should("equal", 200);
    })
    cy.getByDataCy("order-shipping-info").contains("Delivered on");
  })

})
