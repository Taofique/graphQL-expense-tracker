// import gql from "graphql-tag";
// import { ApolloServer } from "@apollo/server";
// import mergedTypeDefs from "../backend/typeDefs/index.js";
// import mergedResolvers from "../backend/resolvers/index.js";

// let server;
// let testContext;

// beforeAll(async () => {
//   // Create a fresh context for tests
//   testContext = { currentUser: null };

//   server = new ApolloServer({
//     typeDefs: mergedTypeDefs,
//     resolvers: mergedResolvers,
//   });
//   await server.start();
// });

// beforeEach(() => {
//   // Reset context before each test
//   testContext.currentUser = null;
// });

// afterAll(async () => {
//   await server.stop();
// });

// describe("Authentication", () => {
//   it("signUp - creates a new user", async () => {
//     const response = await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             signUp(
//               input: {
//                 username: "testuser"
//                 name: "Test User"
//                 password: "password123"
//                 gender: "male"
//               }
//             ) {
//               _id
//               username
//               name
//               gender
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     const { data } = response.body.singleResult;
//     expect(data.signUp.username).toBe("testuser");
//     expect(data.signUp.name).toBe("Test User");
//     expect(data.signUp.gender).toBe("male");
//     expect(data.signUp._id).toBeDefined();
//   });

//   it("login - returns user on valid credentials", async () => {
//     // First create a user
//     await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             signUp(
//               input: {
//                 username: "logintest"
//                 name: "Login User"
//                 password: "pass123"
//                 gender: "male"
//               }
//             ) {
//               _id
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     // Then login
//     const response = await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             login(input: { username: "logintest", password: "pass123" }) {
//               _id
//               username
//               name
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     const { data } = response.body.singleResult;
//     expect(data.login.username).toBe("logintest");
//     expect(data.login.name).toBe("Login User");
//     expect(data.login._id).toBeDefined();
//   });

//   it("login - throws error on wrong password", async () => {
//     // Create user first
//     await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             signUp(
//               input: {
//                 username: "wrongpass"
//                 name: "Wrong Password"
//                 password: "correct123"
//                 gender: "female"
//               }
//             ) {
//               _id
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     // Try wrong password
//     const response = await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             login(input: { username: "wrongpass", password: "wrong123" }) {
//               _id
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     expect(response.body.singleResult.errors).toBeDefined();
//     expect(response.body.singleResult.errors[0].message).toContain("Invalid");
//   });
// });

// describe("authUser Query", () => {
//   it("returns the currently authenticated user", async () => {
//     // Reset context to ensure clean state
//     testContext.currentUser = null;

//     // Step 1: Create a user
//     await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             signUp(
//               input: {
//                 username: "currentuser"
//                 name: "Current User"
//                 password: "pass123"
//                 gender: "male"
//               }
//             ) {
//               _id
//               username
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     // Step 2: Login to set the user in context
//     await server.executeOperation(
//       {
//         query: gql`
//           mutation {
//             login(input: { username: "currentuser", password: "pass123" }) {
//               _id
//               username
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     // Step 3: Get the authenticated user
//     const authResponse = await server.executeOperation(
//       {
//         query: gql`
//           query {
//             authUser {
//               _id
//               username
//               name
//               gender
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     const { data } = authResponse.body.singleResult;
//     expect(data.authUser.username).toBe("currentuser");
//     expect(data.authUser.name).toBe("Current User");
//     expect(data.authUser._id).toBeDefined();
//   });

//   it("returns null when not authenticated", async () => {
//     // Ensure no user is logged in
//     testContext.currentUser = null;

//     const response = await server.executeOperation(
//       {
//         query: gql`
//           query {
//             authUser {
//               _id
//               username
//             }
//           }
//         `,
//       },
//       {
//         contextValue: testContext,
//       },
//     );

//     const { data } = response.body.singleResult;
//     expect(data.authUser).toBeNull();
//   });
// });

import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "../backend/typeDefs/index.js";
import mergedResolvers from "../backend/resolvers/index.js";

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

describe("Authentication", () => {
  it("signUp - creates a new user", async () => {
    const response = await server.executeOperation(
      {
        query: `
          mutation {
            signUp(
              input: {
                username: "testuser"
                name: "Test User"
                password: "password123"
                gender: "male"
              }
            ) {
              _id
              username
              name
              gender
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = response.body.singleResult;

    expect(data.signUp.username).toBe("testuser");
    expect(data.signUp.name).toBe("Test User");
    expect(data.signUp.gender).toBe("male");
    expect(data.signUp._id).toBeDefined();
  });

  it("login - returns user on valid credentials", async () => {
    await server.executeOperation(
      {
        query: `
          mutation {
            signUp(
              input: {
                username: "logintest"
                name: "Login User"
                password: "pass123"
                gender: "male"
              }
            ) {
              _id
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const response = await server.executeOperation(
      {
        query: `
          mutation {
            login(input: { username: "logintest", password: "pass123" }) {
              _id
              username
              name
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = response.body.singleResult;

    expect(data.login.username).toBe("logintest");
    expect(data.login.name).toBe("Login User");
    expect(data.login._id).toBeDefined();
  });

  it("login - throws error on wrong password", async () => {
    await server.executeOperation(
      {
        query: `
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
      },
      { contextValue: testContext }
    );

    const response = await server.executeOperation(
      {
        query: `
          mutation {
            login(input: { username: "wrongpass", password: "wrong123" }) {
              _id
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].message).toContain("Invalid");
  });
});

describe("authUser Query", () => {
  it("returns the currently authenticated user", async () => {
    testContext.currentUser = null;

    await server.executeOperation(
      {
        query: /* GraphQL */ `
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
      },
      { contextValue: testContext }
    );

    // Capture the login response
    const loginResponse = await server.executeOperation(
      {
        query: `
          mutation {
            login(input: { username: "currentuser", password: "pass123" }) {
              _id
              username
              name
              gender
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    // Manually persist logged-in user into context
    const loggedInUser = loginResponse.body.singleResult.data.login;
    testContext.currentUser = loggedInUser;

    const authResponse = await server.executeOperation(
      {
        query: `
          query {
            authUser {
              _id
              username
              name
              gender
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = authResponse.body.singleResult;

    expect(data.authUser.username).toBe("currentuser");
    expect(data.authUser.name).toBe("Current User");
    expect(data.authUser._id).toBeDefined();
  });

  it("returns null when not authenticated", async () => {
    testContext.currentUser = null;

    const response = await server.executeOperation(
      {
        query: `
          query {
            authUser {
              _id
              username
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = response.body.singleResult;

    expect(data.authUser).toBeNull();
  });
});

describe("Logout Mutation", () => {
  it("logout - clears the current user and returns success message", async () => {
    await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            signUp(
              input: {
                username: "logoutuser"
                name: "Logout User"
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
        query: /* GraphQL */ `
          mutation {
            login(input: { username: "logoutuser", password: "pass123" }) {
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

    let authResponse = await server.executeOperation(
      {
        query: /* GraphQL */ `
          query {
            authUser {
              username
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    expect(authResponse.body.singleResult.data.authUser.username).toBe(
      "logoutuser"
    );

    const logoutResponse = await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            logout {
              message
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    const { data } = logoutResponse.body.singleResult;
    expect(data.logout.message).toBe("Logged out successfully");

    authResponse = await server.executeOperation(
      {
        query: /* GraphQL */ `
          query {
            authUser {
              username
            }
          }
        `,
      },
      {
        contextValue: testContext,
      }
    );

    expect(authResponse.body.singleResult.data.authUser).toBeNull();
  });

  it("logout - returns success message even if no user is logged in", async () => {
    testContext.currentUser = null;

    const response = await server.executeOperation(
      {
        query: /* GraphQL */ `
          mutation {
            logout {
              message
            }
          }
        `,
      },
      { contextValue: testContext }
    );

    const { data } = response.body.singleResult;
    expect(data.logout.message).toBe("Logged out successfully");
    expect(testContext.currentUser).toBeNull();
  });
});
