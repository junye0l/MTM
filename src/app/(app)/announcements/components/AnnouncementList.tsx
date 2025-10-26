import Grid from "@mui/material/GridLegacy";
import type { Announcement } from "@/types/domain";
import { AnnouncementCard } from "./AnnouncementCard";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  return (
    <Grid container spacing={2}>
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </Grid>
  );
}
