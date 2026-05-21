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
        login(
          input {
            username: "queryuser"
            password: "pass123"
          }
        ) {
          _id
          username
        }
      }`,
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
});
