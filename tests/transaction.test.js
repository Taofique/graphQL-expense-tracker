import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "../backend/typeDefs/index.js";
import mergedResolvers from "../backend/resolvers/index.js";
import Transaction from "../backend/models/transaction.model.js";

let server;
let testContext;

beforeAll(async () => {
  testContext = { currentUser: null };

  server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
  });

  await server.start();
});

beforeEach(async () => {
  testContext.currentUser = null;
  await Transaction.deleteMany({});
});

afterAll(async () => {
  await server.stop();
});

describe("Transaction Mutation", () => {
  it("createTransaction - creates a new transaction for authenticated user", async () => {
    await server.executeOperation(
      {
        query: `
          mutation {
            signUp(
              input: {
                username: "transactionuser"
                name: "Transaction User"
                password: "pass123"
                gender: "male"
              }
            ) {
              _id
              username
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    const loginResponse = await server.executeOperation(
      {
        query: `
          mutation {
            login(input: { username: "transactionuser", password: "pass123" }) {
              _id
              username
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    testContext.currentUser = loginResponse.body.singleResult.data.login;

    const createResponse = await server.executeOperation(
      {
        query: `
          mutation {
            createTransaction(
              input: {
                text: "Groceries"
                amount: 50.00
                type: "expense"
                category: "food"
                date: "2026-01-15"
              }
            ) {
              _id
              text
              amount
              type
              category
              date
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    const { data } = createResponse.body.singleResult;
    expect(data.createTransaction.text).toBe("Groceries");
    expect(data.createTransaction.amount).toBe(50.0);
    expect(data.createTransaction.type).toBe("expense");
    expect(data.createTransaction.category).toBe("food");
    expect(data.createTransaction._id).toBeDefined();

    const transactionInDb = await Transaction.findOne({ text: "Groceries" });
    expect(transactionInDb).toBeDefined();
    expect(transactionInDb.userId.toString()).toBe(testContext.currentUser._id);
  });
});

describe("Transaction Query", () => {
  it("transactions - returns all transactions for authenticated user", async () => {
    await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            signUp(
              input: {
                username: "queryuser"
                name: "Query User"
                password: "pass123"
                gender: "male"
              }
            ) {
              _id
              username
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const loginResponse = await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            login(input: { username: "queryuser", password: "pass123" }) {
              _id
              username
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = loginResponse.body.singleResult.data.login;

    await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            createTransaction(
              input: {
                text: "Groceries"
                amount: 50.00
                type: "expense"
                category: "food"
                date: "2026-01-15"
              }
            ) {
              _id
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            createTransaction(
              input: {
                text: "Salary"
                amount: 2000.00
                type: "income"
                category: "saving"
                date: "2024-01-16"
              }
            ) {
              _id
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const queryResponse = await server.executeOperation(
      {
        query: `
          query {
            transactions {
              _id
              text
              amount
              type
              category
              date
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = queryResponse.body.singleResult;
    expect(data.transactions).toHaveLength(2);
    expect(data.transactions[0].text).toBe("Groceries");
    expect(data.transactions[1].text).toBe("Salary");
  });

  it("transaction - returns a single transaction by ID for authenticated user", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(
            input: {
              username: "singleuser"
              name: "Single User"
              password: "pass123"
              gender: "male"
            }
          ) {
            _id
            username
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const loginResponse = await server.executeOperation(
      {
        query: `
        mutation {
          login(
            input: {
              username: "singleuser"
              password: "pass123"
            }
          ) {
            _id
            username
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = loginResponse.body.singleResult.data.login;

    const createResponse = await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(
            input: {
              text: "Rent Payment"
              amount: 1200.00
              type: "expense"
              category: "housing"
              date: "2024-01-20"
            }
          ) {
            _id
            text
            amount
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const transactionId =
      createResponse.body.singleResult.data.createTransaction._id;

    const queryResponse = await server.executeOperation(
      {
        query: `
        query {
          transaction(id: "${transactionId}") {
            _id
            text
            amount
            type
            category
            date
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const { data } = queryResponse.body.singleResult;
    expect(data.transaction.text).toBe("Rent Payment");
    expect(data.transaction.amount).toBe(1200.0);
    expect(data.transaction.type).toBe("expense");
    expect(data.transaction.category).toBe("housing");
    expect(data.transaction._id).toBe(transactionId);
  });

  it("transaction - returns error if transaction not found", async () => {
    // Step 1: Create and login a user
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(
            input: {
              username: "notfounduser"
              name: "Not Found User"
              password: "pass123"
              gender: "male"
            }
          ) {
            _id
            username
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const loginResponse = await server.executeOperation(
      {
        query: `
        mutation {
          login(
            input: {
              username: "notfounduser"
              password: "pass123"
            }
          ) {
            _id
            username
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = loginResponse.body.singleResult.data.login;

    const queryResponse = await server.executeOperation(
      {
        query: `
        query {
          transaction(id: "507f1f77bcf86cd799439011") {
            _id
            text
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    expect(queryResponse.body.singleResult.errors).toBeDefined();
    expect(queryResponse.body.singleResult.errors[0].message).toContain(
      "Transaction not found"
    );
  });
});
