import { gql } from "@apollo/client";

/**
 * Centraliza las consultas y mutaciones GraphQL para que
 * otros módulos (ej. App.tsx, hooks, context) las importen.
 */

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        email
        name
        role
      }
    }
  }
`;

export const ROOMS = gql`
  query Rooms {
    rooms {
      id
      name
      capacity
    }
  }
`;

export const BOOKINGS = gql`
  query Bookings($roomId: ID) {
    bookings(roomId: $roomId) {
      id
      startsAt
      endsAt
      note
      room {
        id
        name
      }
      user {
        email
      }
    }
  }
`;

export const USERS = gql`
  query Users {
    users { 
      id
      email
      name
      role
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: BookingInput!) {
    updateBooking(id: $id, input: $input) {
      id
      startsAt
      endsAt
      note
      room { id name }
      user { email }
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) 
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      name
      capacity
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: RoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      name
      capacity
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      email
      name
      role
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      role
    }
  }
`;  
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;  