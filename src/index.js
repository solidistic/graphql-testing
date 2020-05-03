import { GraphQLServer } from "graphql-yoga";
import { users } from "./samples/users";
import { posts } from "./samples/posts";

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) return users;
      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(__, args) {
      if (!args.query) return posts;
      return posts.filter((post) => {
        if (
          post.body.toLowerCase().includes(args.query.toLowerCase()) ||
          post.title.toLowerCase().includes(args.query.toLowerCase())
        )
          return post;
      });
    },
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.author === parent.id);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is up and running on localhost:4000"));
