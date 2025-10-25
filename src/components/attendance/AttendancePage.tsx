"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PeopleIcon from "@mui/icons-material/PeopleAltRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTimeRounded";
import type { AttendanceRecord, AttendanceStatus } from "@/types/domain";
import { useMentorship } from "@/context/MentorshipContext";
import { PageHeader } from "@/components/common/PageHeader";

const attendanceOptions: { label: string; value: AttendanceStatus }[] = [
  { label: "예정", value: "expected" },
  { label: "출석", value: "checked-in" },
  { label: "지각", value: "late" },
  { label: "결석", value: "absent" },
];

const statusIcons: Record<AttendanceStatus, ReactNode> = {
  expected: <PeopleIcon fontSize="small" />,
  "checked-in": <CheckCircleIcon fontSize="small" />,
  late: <AccessTimeIcon fontSize="small" />, 
  absent: <ErrorIcon fontSize="small" />,
};

const statusNames: Record<AttendanceStatus, string> = {
  expected: "예정",
  "checked-in": "출석",
  late: "지각",
  absent: "결석",
};

export default function AttendancePage() {
  const {
    state: { sessions, mentees },
    dispatch,
  } = useMentorship();

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      ),
    [sessions],
  );

  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(
    sortedSessions[0]?.id,
  );

  const selectedSession = sortedSessions.find((session) => session.id === selectedSessionId);

  const attendanceSummary = selectedSession?.attendance.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<AttendanceStatus, number>,
  ) ?? {};

  const totalAttendees = selectedSession?.attendance.length ?? 0;
  const checkedInCount = attendanceSummary["checked-in"] ?? 0;
  const attendanceProgress = totalAttendees
    ? Math.round((checkedInCount / totalAttendees) * 100)
    : 0;

  const getMentee = (id: string) => mentees.find((mentee) => mentee.id === id);

  const handleStatusChange = (record: AttendanceRecord, status: AttendanceStatus) => {
    dispatch({
      type: "UPDATE_ATTENDANCE_STATUS",
      payload: {
        sessionId: record.sessionId,
        menteeId: record.menteeId,
        status,
      },
    });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="출석"
        description="세션별 출석 현황을 확인하고 즉시 상태를 변경할 수 있습니다."
      />

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="session-select-label">멘토링 세션</InputLabel>
              <Select
                labelId="session-select-label"
                value={selectedSessionId ?? ""}
                label="멘토링 세션"
                onChange={(event) => setSelectedSessionId(event.target.value)}
              >
                {sortedSessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Stack spacing={1} sx={{ minWidth: 220 }}>
              <Typography variant="subtitle2" color="text.secondary">
                출석률
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <LinearProgress
                  variant="determinate"
                  value={attendanceProgress}
                  sx={{ flexGrow: 1, height: 10, borderRadius: 8 }}
                />
                <Typography variant="h6" fontWeight={700}>
                  {attendanceProgress}%
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {totalAttendees}명 중 {checkedInCount}명이 체크인했습니다.
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={1.5}
        useFlexGap
        sx={{ width: "100%" }}
      >
        {attendanceOptions.map((option) => (
          <Box
            key={option.value}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              borderRadius: 999,
              px: 2.5,
              py: 1,
              border: "1px solid rgba(148, 163, 184, 0.4)",
              backgroundColor: "rgba(59,130,246,0.05)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {option.label}
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main">
              {attendanceSummary[option.value] ?? 0}명
            </Typography>
          </Box>
        ))}
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventAvailableIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                참석자 목록
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {selectedSession?.attendance.map((record) => {
                const mentee = getMentee(record.menteeId);
                if (!mentee) return null;
                return (
                  <Stack
                    key={`${record.sessionId}-${record.menteeId}`}
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ md: "center" }}
                    spacing={2}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 200 }}>
                      <Avatar src={mentee.avatarUrl}>{mentee.name.slice(0, 1)}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {mentee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {mentee.organization}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <ToggleButtonGroup
                      color="primary"
                      exclusive
                      value={record.status}
                      onChange={(_, value: AttendanceStatus | null) => {
                        if (!value) return;
                        handleStatusChange(record, value);
                      }}
                      size="small"
                      sx={{
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: { xs: "center", md: "flex-end" },
                        "& .MuiToggleButtonGroup-grouped": {
                          margin: 0,
                          borderRadius: 999,
                          border: "1px solid rgba(148, 163, 184, 0.4)",
                          px: 1.8,
                          py: 0.9,
                          gap: 0.75,
                          textTransform: "none",
                          fontWeight: 600,
                          minWidth: 96,
                          justifyContent: "center",
                        },
                      }}
                    >
                      {attendanceOptions.map((option) => (
                        <ToggleButton key={option.value} value={option.value}>
                          {statusIcons[option.value]}
                          <Typography variant="body2" fontWeight={600}>
                            {statusNames[option.value]}
                          </Typography>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    <Typography variant="caption" color="text.secondary">
                      업데이트: {new Date(record.updatedAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
            <Box>
              <Button variant="outlined">출석부 엑셀 다운로드 (향후)</Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

