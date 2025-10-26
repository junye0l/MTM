import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import CampaignIcon from "@mui/icons-material/CampaignRounded";
import type { Announcement } from "@/types/domain";

const audienceLabels: Record<Announcement["audience"], string> = {
  all: "전체",
  mentors: "멘토",
  mentees: "멘티",
};

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 3, height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CampaignIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {announcement.title}
            </Typography>
            <Chip
              label={audienceLabels[announcement.audience]}
              variant="outlined"
              color="secondary"
              size="small"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {announcement.content}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
            <Typography variant="caption" color="text.secondary">
              게시일 {new Date(announcement.createdAt).toLocaleString("ko-KR")}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
