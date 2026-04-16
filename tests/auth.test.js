// tests/auth.test.js
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "../backend/typeDefs/index.js";
import mergedResolvers from "../backend/resolvers/index.js";

let server;

beforeAll(async () => {
  server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
  });
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Authentication", () => {
  it("signUp - creates a new user", async () => {
    const response = await server.executeOperation({
      query: `
        mutation {
          signUp(input: {
            username: "testuser",
            name: "Test User", 
            password: "password123",
            gender: "male"
          }) {
            _id
            username
            name
            gender
          }
        }
      `,
    });

    const { data } = response.body.singleResult;
    expect(data.signUp.username).toBe("testuser");
    expect(data.signUp.name).toBe("Test User");
    expect(data.signUp.gender).toBe("male");
    expect(data.signUp._id).toBeDefined();
  });
});
