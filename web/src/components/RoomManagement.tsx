import React, { useState } from "react";
import { Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRooms } from "../hooks/useRooms";
import { useRoomMutations } from "../hooks/useRoomMutations";
import type { Room } from "../types";

/**
 * Simple room maintenance UI:
 * - muestra rooms
 * - crear / editar via modal
 * - delete con confirm
 */
export const RoomManagement: React.FC<{ onChange?: () => void }> = ({ onChange }) => {
  const { data, refetch } = useRooms();
  const { createRoom, creating, updateRoom, updating, deleteRoom } = useRoomMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");

  const openForCreate = () => {
    setEditing(null);
    setName("");
    setCapacity("");
    setOpen(true);
  };
  const openForEdit = (r: Room) => {
    setEditing(r);
    setName(r.name);
    setCapacity(r.capacity);
    setOpen(true);
  };

  const handleSave = async () => {
    const cap = typeof capacity === "string" ? Number(capacity) : capacity;
    if (!name || !cap) return alert("Nombre y capacidad requeridos");
    try {
      if (editing) {
        await updateRoom({ variables: { id: editing.id, input: { name, capacity: cap } } });
      } else {
        await createRoom({ variables: { input: { name, capacity: cap } } });
      }
      if (refetch) await refetch();
      if (onChange) onChange();
      setOpen(false);
    } catch (err: any) {
      alert(err?.message || "Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar sala?")) return;
    try {
      await deleteRoom({ variables: { id } });
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
          <Typography variant="h6">Mantenimiento de Salas</Typography>
          <Button variant="contained" onClick={openForCreate}>Nueva Sala</Button>
        </Stack>

        <List>
          {data?.rooms?.map((r: Room) => (
            <ListItem key={r.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => openForEdit(r)}><EditIcon /></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(r.id)}><DeleteIcon /></IconButton>
                </>
              }>
              <ListItemText primary={r.name} secondary={`Capacidad: ${r.capacity}`} />
            </ListItem>
          ))}
          {(!data || data.rooms.length === 0) && <Typography color="text.secondary">(no hay salas)</Typography>}
        </List>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar Sala" : "Crear Sala"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField label="Nombre" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Capacidad" type="number" value={capacity} onChange={e => setCapacity(e.target.value ? Number(e.target.value) : "")} fullWidth />
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