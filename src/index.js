import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: "random123",
        name: "Janne Mulari",
        email: "jannemulari@kamk.fi",
        age: 30,
      };
    },
    post() {
      return {
        id: "random331",
        title: "C++, from beginner to advanced",
        body: "Very informative book for everyone who want to learn C/C++",
        published: false,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is up and running on localhost:4000"));
