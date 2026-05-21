import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "../backend/typeDefs";
import mergedResolvers from "../backend/resolvers";
import Transaction from "../backend/models/transaction.model";

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

beforeEach(() => {
  testContext.currentUser = null;
});

afterAll(async () => {
  await server.stop();
});

decribe("Transaction Mutation", () => {
  it("crateTransaction - creates a new transaction for authenticated user", async () => {
    await server.executeOperation(
      {
        query: /* GraphQL */ `
                mutation: {
                    signup(
                        input: {
                            username: "transactionuser",
                            name: "Transaction User",
                            password: "pass123",
                            gender: "male"
                        }
                    ) {
                        _id
                        username
                    }
                }`,
      },
      {
        contextValue: testContext,
      }
    );

    const loginResponse = await server.executeOperation(
      {
        query: /* GraphQL */ `
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
              text
              amount
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
  });
});
