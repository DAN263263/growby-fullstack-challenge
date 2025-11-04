import React, { useMemo } from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, Divider, Typography, IconButton } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import type { Booking } from "../types";
import { formatDateSafe } from "../utils/date";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";

export const BookingList: React.FC<{ 
    bookings?: Booking[] | null;
    onEdit?: (booking: Booking) => void;
    onDelete?: (id: string) => void;
 }> = React.memo(function BookingList({ bookings, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const formatted = useMemo(() => {
    if (!bookings) return [];
    return bookings.map((b) => ({
      id: b.id,
      booking: b,
      primary: `${b.room?.name ?? "Sala desconocida"} — ${formatDateSafe(b.startsAt)} → ${formatDateSafe(b.endsAt)}`,
      secondary: b.user?.email ?? "Usuario desconocido",
      note: b.note ?? "-"
    }));
  }, [bookings]);

  if (formatted.length === 0) return <Typography color="text.secondary">(sin reservas)</Typography>;

  return (
    <List>
      {formatted.map((f) => (
        <div key={f.id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              isAdmin ? (
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => onEdit?.(f.booking)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete?.(f.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : null
            }
          >
            <ListItemAvatar>
              <Avatar><EventIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={f.primary}
              secondary={<><PersonIcon fontSize="small" sx={{ mr: 0.5 }} /> {f.secondary}</>}
            />
          </ListItem>
          <Divider component="li" />
        </div>
      ))}
    </List>
  );
});