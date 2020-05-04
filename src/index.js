import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";
import { users } from "./samples/users";
import { posts } from "./samples/posts";
import { comments } from "./samples/comments";

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, post: ID!, author: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments() {
      return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      // if (!args) return;

      const emailTaken = users.some((user) => user.email === args.email);

      if (emailTaken) throw new Error("Email taken");

      const newUser = {
        id: uuidv4(),
        ...args,
      };

      users.push(newUser);
      return newUser;
    },
    createPost(parent, args) {
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) throw new Error("User not found");

      const newPost = {
        id: uuidv4(),
        ...args,
      };

      posts.push(newPost);

      return newPost;
    },
    createComment(parent, args) {
      const postExists = posts.some((post) => post.id === args.post);
      const authorExists = users.some((user) => user.id === args.author);

      if (!postExists || !authorExists)
        throw new Error("Invalid input, please try again");

      const isPublished = posts.find((post) => post.id === args.post).published;

      if (!isPublished) throw new Error("Post has not been published");

      const newComment = {
        id: uuidv4(),
        ...args,
      };

      comments.push(newComment);

      return newComment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is up and running on localhost:4000"));
