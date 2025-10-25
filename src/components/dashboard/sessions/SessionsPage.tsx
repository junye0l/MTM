"use client";

import { useMemo, useState } from "react";
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
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AddIcon from "@mui/icons-material/AddRounded";
import EventIcon from "@mui/icons-material/EventRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceIcon from "@mui/icons-material/PlaceRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useMentorship } from "@/context/MentorshipContext";
import { PageHeader } from "@/components/common/PageHeader";
import type { Session } from "@/types/domain";

const formatSessionDate = (iso: string) =>
  format(new Date(iso), "yyyy년 M월 d일 (EEE) a h:mm", { locale: ko });

const formatDuration = (startAt: string, endAt: string) => {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const diffMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  if (diffMinutes === 0) return "시간 미정";
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${minutes}분`;
};

const defaultAgendaTemplate = `19:00|체크인 & 인사|관심사 파악\n19:15|주요 주제 세션|핵심 개념 정리\n20:00|Q&A 및 실습 피드백|멘티 고민 해결`;

const focusTagPresets = ["React", "TypeScript", "코드리뷰", "취업준비", "프로젝트"];

const locationOptions = [
  { label: "온라인 (Google Meet)", value: "온라인 (Google Meet)" },
  { label: "직접 입력", value: "custom" },
];

export default function SessionsPage() {
  const {
    state: { sessions },
    dispatch,
  } = useMentorship();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [locationMode, setLocationMode] = useState(locationOptions[0].value);
  const [customLocation, setCustomLocation] = useState("");
  const [description, setDescription] = useState("");
  const [focusTagsInput, setFocusTagsInput] = useState<string[]>([]);
  const [agendaInput, setAgendaInput] = useState(defaultAgendaTemplate);
  const [resourcesInput, setResourcesInput] = useState("사전 읽기 자료|https://example.com");

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
      ),
    [sessions],
  );

  const manualTags = focusTagsInput.filter((tag) => !focusTagPresets.includes(tag));

  const selectedTags = Array.from(new Set([...focusTagsInput]));

  const isFormValid =
    title.trim() &&
    startAt &&
    endAt &&
    description.trim() &&
    (locationMode !== "custom" ? true : customLocation.trim().length > 0);

  const resetForm = () => {
    setTitle("");
    setStartAt("");
    setEndAt("");
    setLocationMode(locationOptions[0].value);
    setCustomLocation("");
    setDescription("");
    setFocusTagsInput([]);
    setAgendaInput(defaultAgendaTemplate);
    setResourcesInput("사전 읽기 자료|https://example.com");
  };

  const parseAgenda = (): Session["agenda"] =>
    agendaInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [time, topic, goal] = line.split("|").map((segment) => segment.trim());
        return {
          time: time ?? "",
          topic: topic ?? "",
          goal,
        };
      })
      .filter((item) => item.time && item.topic);

  const parseResources = (): Session["resources"] =>
    resourcesInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((segment) => segment.trim());
        return { label: label ?? "자료", url: url ?? "#" };
      });

  const togglePresetTag = (tag: string) => {
    setFocusTagsInput((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleManualTagChange = (value: string) => {
    const values = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFocusTagsInput((prev) => {
      const presetSelected = prev.filter((tag) => focusTagPresets.includes(tag));
      return [...presetSelected, ...values];
    });
  };

  const locationValue =
    locationMode === "custom" ? customLocation.trim() || "장소 미정" : locationMode;

  const handleSubmit = () => {
    if (!isFormValid) return;
    dispatch({
      type: "ADD_SESSION",
      payload: {
        title: title.trim(),
        startAt,
        endAt,
        location: locationValue,
        description: description.trim(),
        focusTags: selectedTags,
        agenda: parseAgenda(),
        resources: parseResources(),
      },
    });
    setOpen(false);
    resetForm();
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="일정"
        description="다가오는 세션을 확인하고 새 일정을 등록하세요."
        actions={(
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              onClick={() => setOpen(true)}
              sx={{ minWidth: { sm: 160 } }}
            >
              새 일정 등록
            </Button>
          </Stack>
        )}
      />

      <Grid container spacing={2}>
        {sortedSessions.map((session) => (
          <Grid item xs={12} md={6} key={session.id}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <EventIcon color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {session.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatSessionDate(session.startAt)} · {formatDuration(session.startAt, session.endAt)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {session.focusTags.map((tag) => (
                    <Chip key={tag} label={tag} color="primary" variant="outlined" size="small" />
                  ))}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {session.description}
                </Typography>

                <Box
                  sx={{
                    borderRadius: 2,
                    border: "1px solid rgba(148,163,184,0.3)",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatSessionDate(session.startAt)} ~ {new Date(session.endAt).toLocaleTimeString("ko-KR")}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PlaceIcon fontSize="small" color="action" />
                    <Typography variant="body2">{session.location}</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Agenda
                    </Typography>
                    <Stack spacing={1}>
                      {session.agenda.map((item) => (
                        <Stack key={`${item.time}-${item.topic}`} direction="row" spacing={2}>
                          <Typography variant="body2" sx={{ minWidth: 64 }}>
                            {item.time}
                          </Typography>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {item.topic}
                            </Typography>
                            {item.goal ? (
                              <Typography variant="caption" color="text.secondary">
                                목표: {item.goal}
                              </Typography>
                            ) : null}
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Box>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    참고 자료
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {session.resources.map((resource) => (
                      <Button
                        key={resource.url}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                      >
                        {resource.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
          새 멘토링 일정 등록
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="세션 제목"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            fullWidth
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="시작 일시"
              type="datetime-local"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="종료 일시"
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>
          <TextField
            select
            label="진행 방식"
            value={locationMode}
            onChange={(event) => setLocationMode(event.target.value)}
            fullWidth
          >
            {locationOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {locationMode === "custom" ? (
            <TextField
              label="장소 상세"
              placeholder="예: 서울시 강남구 선릉로 00길 00, MTM 라운지"
              value={customLocation}
              onChange={(event) => setCustomLocation(event.target.value)}
              fullWidth
              required
            />
          ) : null}
          <TextField
            label="세션 설명"
            multiline
            minRows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              포커스 태그
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {focusTagPresets.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => togglePresetTag(tag)}
                  />
                );
              })}
            </Stack>
          </Box>
          <TextField
            label="추가 태그 (쉼표로 구분)"
            placeholder="예: 웹 접근성, 코드 품질"
            value={manualTags.join(", ")}
            onChange={(event) => handleManualTagChange(event.target.value)}
            fullWidth
          />
          <TextField
            label="진행 순서 (각 줄에 시간|주제|목표)"
            multiline
            minRows={4}
            value={agendaInput}
            onChange={(event) => setAgendaInput(event.target.value)}
            helperText="예: 19:00|체크인 & 인사|관심사 파악"
          />
          <TextField
            label="자료 링크 (각 줄에 라벨|URL)"
            multiline
            minRows={3}
            value={resourcesInput}
            onChange={(event) => setResourcesInput(event.target.value)}
            helperText="예: 사전 읽기 자료|https://example.com"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!isFormValid}>
            일정 등록
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
