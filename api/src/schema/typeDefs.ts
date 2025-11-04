import { gql } from "apollo-server-express";

// Tipos y operaciones mínimos para CRUD + login
export const typeDefs = gql`
  enum Role { ADMIN USER }

  type User { id: ID!, email: String!, name: String!, role: Role! }
  type Room { id: ID!, name: String!, capacity: Int!, bookings: [Booking!]! }
  type Booking { id: ID!, room: Room!, user: User!, startsAt: String!, endsAt: String!, note: String }

  type Query {
    me: User
    rooms(search: String): [Room!]!
    bookings(roomId: ID, from: String, to: String): [Booking!]!
    users(search: String): [User!]!
  }

  input BookingInput { roomId: ID!, startsAt: String!, endsAt: String!, note: String }
  input RoomInput { name: String!, capacity: Int! }
  input UserInput { email: String!, name: String!, role: Role!, password: String! }
  type AuthPayload { token: String!, user: User! }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createRoom(input: RoomInput!): Room!
    updateRoom(id: ID!, input: RoomInput!): Room!
    deleteRoom(id: ID!): Boolean!
    createBooking(input: BookingInput!): Booking!
    updateBooking(id: ID!, input: BookingInput!): Booking!
    deleteBooking(id: ID!): Boolean!
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
