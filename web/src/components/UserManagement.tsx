import React, { useState } from "react";
import { Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUsers } from "../hooks/useUsers";
import { useUserMutations } from "../hooks/useUsersMutation";
import type { User } from "../types";

export const UserManagement: React.FC<{ onChange?: () => void }> = ({ onChange }) => {
  const { data, refetch, loading } = useUsers();
  const { createUser, creating, updateUser, updating, deleteUser, deleting } = useUserMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("USER");
  const [name, setName] = useState("");

  const openForCreate = () => {
    setEditing(null);
    setEmail("");
    setPassword("");
    setRole("USER");
    setOpen(true);
    setName("");
  };

  const openForEdit = (u: User) => {
    setEditing(u);
    setEmail(u.email);
    setPassword("");
    setRole(u.role);
    setOpen(true);
    setName(u.name);
  };

  const handleSave = async () => {
    if (!email) return alert("Email requerido");
    if (!name) return alert("Nombre requerido");
    if (!role) return alert("Rol requerido");

    try {
      if (editing) {
        const input: any = { email, name, role };
        if (password) input.password = password;
        await updateUser({ variables: { id: editing.id, input } });
      } else {
        if (!password) return alert("Password requerido para crear usuario");
        await createUser({ variables: { input: { email, name, password, role } } });
      }
      if (refetch) await refetch();
      if (onChange) onChange();
      setOpen(false);
    } catch (err: any) {
      alert(err?.message || "Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      await deleteUser({ variables: { id } });
      if (refetch) await refetch();
      if (onChange) onChange();
    } catch (err: any) {
      alert(err?.message || "Error al eliminar");
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Mantenimiento de Usuarios</Typography>
          <Button variant="contained" onClick={openForCreate}>Nuevo Usuario</Button>
        </Stack>

        <List>
          {data?.users?.map((u: User) => (
            <ListItem key={u.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => openForEdit(u)}><EditIcon /></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(u.id)}><DeleteIcon /></IconButton>
                </>
              }>
              <ListItemText primary={u.email} secondary={`Rol: ${u.role}`} />
            </ListItem>
          ))}
          {(!data || data.users.length === 0) && <Typography color="text.secondary">(no hay usuarios)</Typography>}
        </List>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Nombre" type="text" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} placeholder={editing ? "(dejar vacío para no cambiar)" : ""} />
            <FormControl fullWidth>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select labelId="role-label" label="Rol" value={role} onChange={e => setRole(e.target.value)}>
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={creating || updating}>{creating || updating ? "Guardando..." : "Guardar"}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};