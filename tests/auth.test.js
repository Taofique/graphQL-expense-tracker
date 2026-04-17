import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "../backend/typeDefs/index.js";
import mergedResolvers from "../backend/resolvers/index.js";
import gql from "graphql-tag";
import { query } from "express";

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

  it("login - returns user on valid credentials", async () => {
    await server.executeOperation({
      query: `
      mutation {
        signUp(input: {
          username: "logintest",
          name: "Login User",
          password: "pass123",
          gender: "male"
        }) {
          _id
        }
      }
    `,
    });

    const response = await server.executeOperation({
      query: gql`
        mutation {
          login(input: { username: "logintest", password: "pass123" }) {
            _id
            username
            name
          }
        }
      `,
    });

    const { data } = response.body.singleResult;
    expect(data.login.username).toBe("logintest");
    expect(data.login.name).toBe("Login User");
    expect(data.login._id).toBeDefined();
  });

  it("login - throws error on wrong password", async () => {
    await server.executeOperation({
      query: gql`
        mutation {
          signUp(
            input: {
              username: "wrongpass"
              name: "Wrong Password"
              password: "correct123"
              gender: "female"
            }
          ) {
            _id
          }
        }
      `,
    });

    const response = await server.executeOperation({
      query: gql`
        mutation {
          login(input: { username: "wrongpass", password: "wrong123" }) {
            _id
          }
        }
      `,
    });

    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].message).toContain("Invalid");
  });
});

describe("authUser Query", () => {
  it("returns the currently authenticated user", async () => {
    const signupResponse = await server.executeOperation({
      query: gql`
        mutation {
          signUp(
            input: {
              username: "currentuser"
              name: "Current User"
              password: "pass123"
              gender: "male"
            }
          ) {
            _id
            username
          }
        }
      `,
    });

    const loginResponse = await server.executeOperation({
      query: gql`
        mutation {
          login(input: { username: "currentuser", password: "pass123" }) {
            _id
            username
          }
        }
      `,
    });

    const authResponse = await server.executeOperation({
      query: gql`
        query {
          authUser {
            _id
            username
            name
            gender
          }
        }
      `,
    });

    const data = authResponse.body.singleResult;
    expect(data.authUser.username).toBe("currentuser");
    expect(data.authUser.name).toBe("Current User");
    expect(data.authUser._id).toBeDefined();
  });

  it("returns null when not authenticated", async () => {
    const response = await server.executeOperation({
      query: gql`
        query {
          authUser {
            _id
            username
          }
        }
      `,
    });

    const { data } = response.body.singleResult;
    expect(data.authUser).toBeNull();
  });
});
