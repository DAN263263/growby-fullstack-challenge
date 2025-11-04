export type User = { id: string; email: string; role: string; name: string; password: string };
export type Room = { id: string; name: string; capacity: number };
export type Booking = {
  id: string;
  startsAt: string;
  endsAt: string;
  note?: string | null;
  room: { name: string };
  user: { email: string };
};
export type UsersData = { users: User[] };
export type RoomsData = { rooms: Room[] };
export type BookingsData = { bookings: Booking[] };
export type BookingsVars = { roomId: string};
export type LoginData = { login: { token: string; user: User } };
export type LoginVars = { email: string; password: string };
export type CreateBookingVars = { input: { roomId: string; startsAt: string; endsAt: string; note?: string } };
export type CreateBookingData = { createBooking: { id: string } };
export type UpdateBookingVars = { id: string; input: { startsAt?: string; endsAt?: string; note?: string; roomId?: string } };
export type UpdateBookingData = { updateBooking: { id: string; startsAt: string; endsAt: string; note?: string | null; room: { id: string; name: string }; user: { email: string } } };

export type DeleteBookingVars = { id: string };
export type DeleteBookingData = { deleteBooking: boolean};

export type CreateRoomVars = { input: { name: string; capacity: number } };
export type CreateRoomData = { createRoom: { id: string; name: string; capacity: number } };

export type UpdateRoomVars = { id: string; input: { name?: string; capacity?: number } };
export type UpdateRoomData = { updateRoom: { id: string; name: string; capacity: number } };

export type DeleteRoomVars = { id: string };
export type DeleteRoomData = { deleteRoom: boolean };

export type CreateUserVars = { input: { email: string; name: string; role: string; password: string } };
export type CreateUserData = { createUser: { id: string; email: string; name: string; role: string } };
export type UpdateUserVars = { id: string; input: { email?: string; name?: string; role?: string; password?: string } };
export type UpdateUserData = { updateUser: { id: string; email: string; name: string; role: string } };
export type DeleteUserVars = { id: string };
export type DeleteUserData = { deleteUser: boolean };
