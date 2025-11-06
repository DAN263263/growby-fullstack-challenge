
import {useState } from "react";
import LoginPage from "./pages/LoginPage";
import ReservationsPage from "./pages/ReservationsPage";
import RoomsPage from "./pages/RoomsPage";
import UsersPage from "./pages/UsersPage";
import {
  Avatar,
  Button,
  Container,
  Stack,
  Typography,
  Box
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppInner() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const [page, setPage] = useState<"login" | "reservations" | "rooms" | "users">(() => isAuthenticated ? "reservations" : "login");
  

  const handleLogout = () => {
    logout();
  };
  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>R</Avatar>
          <Box>
            <Typography variant="h5">Mini ERP – Reservas</Typography>
            <Typography variant="caption" color="text.secondary">
              {isAdmin 
                ? (isAuthenticated && user ? `Admin Dashboard - ${user.email} - ${user.name}` : "Admin Dashboard") 
                : (isAuthenticated && user ? `User Dashboard - ${user.email} - ${user.name}` : "User Dashboard")}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {isAuthenticated ? (
            <>
              <Button variant={page === "reservations" ? "contained" : "text"} onClick={() => setPage("reservations")}>Reservas</Button>
              {isAdmin && <Button variant={page === "rooms" ? "contained" : "text"} onClick={() => setPage("rooms")}>Salas</Button>}
              {isAdmin && <Button variant={page === "users" ? "contained" : "text"} onClick={() => setPage("users")}>Usuarios</Button>}
              <Button onClick={() => { handleLogout(); setPage("login"); }} startIcon={<LogoutIcon />}>Logout</Button>
            </>
          ) : null}
        </Stack>
      </Stack>

      <Box>
        {page === "login" && <LoginPage onSuccess={() => setPage("reservations")} />}
        {page === "reservations" && isAuthenticated && <ReservationsPage />}
        {page === "rooms" && isAuthenticated && <RoomsPage />}
        {page === "users" && isAuthenticated && <UsersPage />}
      </Box>
    </Container>
  );
 }

export default function App() {

  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
