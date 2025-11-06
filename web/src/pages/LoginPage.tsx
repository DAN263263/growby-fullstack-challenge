import { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) { setError("Email y password son requeridos"); return; }
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message ?? "Error al autenticar");
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: "auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Ingresar</Typography>
          <Stack spacing={2}>
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={handleLogin} disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
            {loading ? "Ingresando..." : "Login"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}