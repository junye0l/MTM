"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import CampaignIcon from "@mui/icons-material/CampaignRounded";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import type { Announcement } from "@/types/domain";
import { useMentorship } from "@/context/MentorshipContext";
import { PageHeader } from "@/components/common/PageHeader";
import { CtaButton } from "@/components/common/CtaButton";

const audienceLabels: Record<Announcement["audience"], string> = {
  all: "전체",
  mentors: "멘토",
  mentees: "멘티",
};

export default function AnnouncementsPage() {
  const {
    state: { announcements },
    dispatch,
  } = useMentorship();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>("mentees");
  const [actionUrl, setActionUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAudience("mentees");
    setActionUrl("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    dispatch({
      type: "ADD_ANNOUNCEMENT",
      payload: {
        title: title.trim(),
        content: content.trim(),
        audience,
        actionUrl: actionUrl.trim() || undefined,
      },
    });
    resetForm();
    setOpen(false);
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="공지"
        description="멘티와 멘토에게 전달할 공지를 작성하고 관리하세요."
        actions={(
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <CtaButton
              label="새 공지 작성"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{ minWidth: { sm: 160 } }}
            />
          </Stack>
        )}
      />

      <Grid container spacing={2}>
        {announcements.map((announcement) => (
          <Grid item xs={12} md={6} key={announcement.id}>
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
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>새 공지 작성</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="제목"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="내용"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            multiline
            minRows={4}
            required
          />
          <FormControl>
            <InputLabel id="audience-label">대상</InputLabel>
            <Select
              labelId="audience-label"
              value={audience}
              label="대상"
              onChange={(event) => setAudience(event.target.value as Announcement["audience"])}
            >
              <MenuItem value="mentees">멘티</MenuItem>
              <MenuItem value="mentors">멘토</MenuItem>
              <MenuItem value="all">전체</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="연결 링크 (선택)"
            value={actionUrl}
            onChange={(event) => setActionUrl(event.target.value)}
            placeholder="https://..."
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!title.trim() || !content.trim()}>
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
