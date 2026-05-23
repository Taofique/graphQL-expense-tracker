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

/* ---------------- CREATE ---------------- */

describe("Transaction Mutation", () => {
  it("createTransaction - creates a transaction", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(input: {
            username: "user1"
            name: "User"
            password: "pass123"
            gender: "male"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const loginResponse = await server.executeOperation(
      {
        query: `
        mutation {
          login(input: { username: "user1", password: "pass123" }) {
            _id
            username
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = loginResponse.body.singleResult.data.login;

    const res = await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input: {
            description: "Groceries"
            amount: 50
            type: "expense"
            paymentType: "cash"
            category: "food"
            date: "2026-01-15"
          }) {
            _id
            description
            amount
            type
            paymentType
            category
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const data = res.body.singleResult.data.createTransaction;

    expect(data.description).toBe("Groceries");
    expect(data.amount).toBe(50);
  });
});

/* ---------------- READ ---------------- */

describe("Transaction Query", () => {
  it("returns all transactions", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(input:{ username:"u1", name:"U1", password:"pass123", gender:"male"}) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const login = await server.executeOperation(
      {
        query: `
        mutation {
          login(input:{ username:"u1", password:"pass123"}) { _id username }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = login.body.singleResult.data.login;

    await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input:{
            description:"Groceries"
            amount:50
            type:"expense"
            paymentType:"cash"
            category:"food"
            date:"2026-01-15"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input:{
            description:"Salary"
            amount:2000
            type:"income"
            paymentType:"card"
            category:"saving"
            date:"2024-01-16"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const res = await server.executeOperation(
      {
        query: `
        query {
          transactions {
            _id
            description
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    const txs = res.body.singleResult.data.transactions;

    expect(txs.length).toBe(2);
  });

  it("returns single transaction", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(input:{ username:"u2", name:"U2", password:"pass123", gender:"male"}) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const login = await server.executeOperation(
      {
        query: `
        mutation {
          login(input:{ username:"u2", password:"pass123"}) { _id username }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = login.body.singleResult.data.login;

    const created = await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input:{
            description:"Rent"
            amount:1200
            type:"expense"
            paymentType:"cash"
            category:"housing"
            date:"2024-01-20"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const id = created.body.singleResult.data.createTransaction._id;

    const res = await server.executeOperation(
      {
        query: `
        query {
          transaction(id:"${id}") {
            _id
            description
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    expect(res.body.singleResult.data.transaction.description).toBe("Rent");
  });
});

/* ---------------- UPDATE ---------------- */

describe("Update Transaction", () => {
  it("updates transaction", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(input:{ username:"u3", name:"U3", password:"pass123", gender:"male"}) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const login = await server.executeOperation(
      {
        query: `
        mutation {
          login(input:{ username:"u3", password:"pass123"}) { _id username }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = login.body.singleResult.data.login;

    const created = await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input:{
            description:"Old"
            amount:100
            type:"expense"
            paymentType:"cash"
            category:"food"
            date:"2024-01-01"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const id = created.body.singleResult.data.createTransaction._id;

    const updated = await server.executeOperation(
      {
        query: `
        mutation {
          updateTransaction(
            id:"${id}",
            input:{
              description:"Updated"
              amount:75
            }
          ) {
            _id
            description
            amount
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    expect(updated.body.singleResult.data.updateTransaction.description).toBe(
      "Updated"
    );
  });
});

/* ---------------- DELETE ---------------- */

describe("Delete Transaction", () => {
  it("deletes transaction", async () => {
    await server.executeOperation(
      {
        query: `
        mutation {
          signUp(input:{ username:"u4", name:"U4", password:"pass123", gender:"male"}) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const login = await server.executeOperation(
      {
        query: `
        mutation {
          login(input:{ username:"u4", password:"pass123"}) { _id username }
        }
      `,
      },
      { contextValue: testContext }
    );

    testContext.currentUser = login.body.singleResult.data.login;

    const created = await server.executeOperation(
      {
        query: `
        mutation {
          createTransaction(input:{
            description:"To Delete"
            amount:99
            type:"expense"
            paymentType:"cash"
            category:"other"
            date:"2024-01-01"
          }) { _id }
        }
      `,
      },
      { contextValue: testContext }
    );

    const id = created.body.singleResult.data.createTransaction._id;

    const deleted = await server.executeOperation(
      {
        query: `
        mutation {
          deleteTransaction(id:"${id}") {
            _id
            description
          }
        }
      `,
      },
      { contextValue: testContext }
    );

    expect(deleted.body.singleResult.data.deleteTransaction._id).toBe(id);
  });
});
