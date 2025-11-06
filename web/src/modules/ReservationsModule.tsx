import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import { useRooms } from "../hooks/useRooms";
import { useBookings } from "../hooks/useBookings";
import { useBookingMutations } from "../hooks/useBookingMutations";
import type {Booking} from "../types";
import { parseToDate } from "../utils/date";
import { BookingList } from "../components/BookingList";

export const ReservationsModule: React.FC = () => {
  const { data: roomsData, loading: roomsLoading } = useRooms();
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const noteRef = useRef<HTMLInputElement | null>(null);

  const { data: bookingsData, refetch } = useBookings(roomId);
  const { createBooking, creating, updateBooking, updating, deleteBooking } = useBookingMutations();

  const [editOpen, setEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editStartsAt, setEditStartsAt] = useState("");
  const [editEndsAt, setEditEndsAt] = useState("");
  const [editNote, setEditNote] = useState<string | undefined>(undefined);
  const [editRoomId, setEditRoomId] = useState<string | undefined>(undefined);
  const [editError, setEditError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!roomId || !startsAt || !endsAt) return alert("Completa sala e intervalos");
    const sDate = parseToDate(startsAt);
    const eDate = parseToDate(endsAt);
    if (!sDate || !eDate) return alert("Formato de fecha no válido");
    if (sDate >= eDate) return alert("La fecha de inicio debe ser anterior a la de fin");
    const s = sDate.toISOString();
    const e = eDate.toISOString();
    const noteValue = noteRef.current?.value?.trim() || undefined;
    try {
      await createBooking({ variables: { input: { roomId, startsAt: s, endsAt: e, note: noteValue } } });
      if (refetch) await refetch();
      setStartsAt("");
      setEndsAt("");
      if (noteRef.current) noteRef.current.value = "";
    } catch (err: any) {
      alert(err?.message || "Error al crear reserva");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar reserva?")) return;
    try {
      await deleteBooking({ variables: { id } });
      if (refetch) await refetch();
    } catch (err: any) {
      alert(err?.message ?? "Error al eliminar");
    }
  };

  const handleEditOpen = (b: Booking) => {
    setEditingBooking(b);
    setEditRoomId((b.room as any)?.id ?? undefined);
    const toInput = (s?: string) => {
      if (!s) return "";
      const d = parseToDate(s);
      if (!d) return "";
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setEditStartsAt(toInput(b.startsAt));
    setEditEndsAt(toInput(b.endsAt));
    setEditNote(b.note ?? undefined);
    setEditError(null);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    setEditError(null);
    const sDate = parseToDate(editStartsAt);
    const eDate = parseToDate(editEndsAt);
    if (!sDate || !eDate) {
      setEditError("Formato de fecha no válido");
      return;
    }
    if (sDate >= eDate) {
      setEditError("La fecha de inicio debe ser anterior a la de fin");
      return;
    }
    try {
      const s = sDate.toISOString();
      const e = eDate.toISOString();
      await updateBooking({ variables: { id: editingBooking.id, input: { startsAt: s, endsAt: e, note: editNote?.trim() || undefined, roomId: editRoomId } } });
      if (refetch) await refetch();
      setEditOpen(false);
      setEditingBooking(null);
    } catch (err: any) {
      setEditError(err?.message ?? "Error al actualizar");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12 , md:5}}>
        <Card>
          <CardContent>
            <Typography variant="h6">Crear Reserva</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="room-filter-label">Sala</InputLabel>
                <Select
                  labelId="room-filter-label"
                  value={roomId ?? "ALL"}
                  label="Sala"
                  onChange={(e) => setRoomId(e.target.value === "ALL" ? undefined : (e.target.value as string))}
                >
                  <MenuItem value="ALL">Todas las salas</MenuItem>
                  {roomsData?.rooms?.map((r) => (<MenuItem key={r.id} value={r.id}>{r.name} ({r.capacity})</MenuItem>))}
                </Select>
              </FormControl>

              <TextField type="datetime-local" label="Inicio" value={startsAt} onChange={e => setStartsAt(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField type="datetime-local" label="Fin" value={endsAt} onChange={e => setEndsAt(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Nota" inputRef={noteRef} defaultValue="" fullWidth />
            </Stack>
          </CardContent>
          <CardActions>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} disabled={creating}>
              {creating ? "Creando..." : "Crear Reserva"}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid size={{xs: 12 , md:7}}>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Reservas</Typography>
              {roomsLoading ? <CircularProgress size={20} /> : <Chip icon={<EventIcon />} label={roomId ? "Filtro por sala" : "Todas las salas"} />}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <BookingList bookings={bookingsData?.bookings ?? []} onEdit={handleEditOpen} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar reserva</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="edit-room-label">Sala</InputLabel>
              <Select labelId="edit-room-label" label="Sala" value={editRoomId ?? "NONE"} onChange={(e) => setEditRoomId(e.target.value === "NONE" ? undefined : (e.target.value as string))}>
                <MenuItem value="NONE">(sin cambiar)</MenuItem>
                {roomsData?.rooms?.map((r) => (<MenuItem key={r.id} value={r.id}>{`${r.name} (${r.capacity})`}</MenuItem>))}
              </Select>
            </FormControl>

            <TextField label="Inicio" type="datetime-local" value={editStartsAt} onChange={(e) => setEditStartsAt(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Fin" type="datetime-local" value={editEndsAt} onChange={(e) => setEditEndsAt(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Nota" value={editNote ?? ""} onChange={(e) => setEditNote(e.target.value)} fullWidth />
            {editError && <Typography color="error">{editError}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={updating}>
            {updating ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ReservationsModule;