"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Avatar,
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswerRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PendingIcon from "@mui/icons-material/PendingActionsRounded";
import RateReviewIcon from "@mui/icons-material/RateReviewRounded";
import AddCommentIcon from "@mui/icons-material/AddCommentRounded";
import type { Question, QuestionStatus } from "@/types/domain";
import { useMentorship } from "@/context/MentorshipContext";
import { PageHeader } from "@/components/common/PageHeader";

const statusTabs: { value: "all" | QuestionStatus; label: string; icon: ReactNode }[] = [
  { value: "all", label: "전체", icon: <QuestionAnswerIcon fontSize="small" /> },
  { value: "pending", label: "대기", icon: <PendingIcon fontSize="small" /> },
  { value: "in-progress", label: "검토 중", icon: <RateReviewIcon fontSize="small" /> },
  { value: "answered", label: "답변 완료", icon: <AssignmentTurnedInIcon fontSize="small" /> },
];

const statusChipProps: Record<QuestionStatus, { label: string; color: "default" | "warning" | "success" }> = {
  pending: { label: "대기", color: "default" },
  "in-progress": { label: "검토 중", color: "warning" },
  answered: { label: "답변 완료", color: "success" },
};

export default function QuestionsPage() {
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
  const [statusFilter, setStatusFilter] = useState<(typeof statusTabs)[number]["value"]>("all");
  const [answeringQuestion, setAnsweringQuestion] = useState<Question | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [askingSessionId, setAskingSessionId] = useState<string | undefined>(sortedSessions[0]?.id);
  const [askingMenteeId, setAskingMenteeId] = useState<string | undefined>(mentees[0]?.id);
  const [questionContent, setQuestionContent] = useState("");
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const selectedSession = sortedSessions.find((session) => session.id === selectedSessionId);

  const filteredQuestions = selectedSession
    ? selectedSession.questions.filter((question) =>
        statusFilter === "all" ? true : question.status === statusFilter,
      )
    : [];

  const handleStatusChange = (question: Question, status: QuestionStatus) => {
    dispatch({
      type: "SET_QUESTION_STATUS",
      payload: {
        sessionId: question.sessionId,
        questionId: question.id,
        status,
      },
    });
  };

  const openAnswerDialog = (question: Question) => {
    setAnsweringQuestion(question);
    setAnswerContent(question.answer?.content ?? "");
  };

  const submitAnswer = () => {
    if (!answeringQuestion || !answerContent.trim()) return;
    dispatch({
      type: "ADD_ANSWER",
      payload: {
        sessionId: answeringQuestion.sessionId,
        questionId: answeringQuestion.id,
        content: answerContent.trim(),
      },
    });
    setAnsweringQuestion(null);
    setAnswerContent("");
  };

  const submitQuestion = () => {
    if (!askingSessionId || !askingMenteeId || !questionContent.trim()) return;
    dispatch({
      type: "ADD_QUESTION",
      payload: {
        sessionId: askingSessionId,
        authorId: askingMenteeId,
        content: questionContent.trim(),
      },
    });
    setQuestionContent("");
    setQuestionDialogOpen(false);
  };

  const getMentee = (id: string) => mentees.find((mentee) => mentee.id === id);

  return (
    <Stack spacing={3}>
      <PageHeader
        title="질문"
        description="멘티 질문의 상태를 업데이트하고 답변을 작성하세요."
        actions={(
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<AddCommentIcon />}
              onClick={() => setQuestionDialogOpen(true)}
              sx={{ minWidth: { sm: 160 } }}
            >
              질문 등록
            </Button>
          </Stack>
        )}
      />

      <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="session-question-label">세션 선택</InputLabel>
              <Select
                labelId="session-question-label"
                value={selectedSessionId ?? ""}
                label="세션 선택"
                onChange={(event) => setSelectedSessionId(event.target.value)}
              >
                {sortedSessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tabs
              value={statusFilter}
              onChange={(_, value) => setStatusFilter(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 48 }}
            >
              {statusTabs.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  iconPosition="start"
                  label={tab.label}
                />
              ))}
            </Tabs>
          </Stack>

          <Grid container spacing={2}>
            {filteredQuestions.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px dashed rgba(148,163,184,0.6)",
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  현재 선택된 조건에 해당하는 질문이 없습니다.
                </Box>
              </Grid>
            ) : (
              filteredQuestions.map((question) => {
                const author = getMentee(question.authorId);
                const chipProps = statusChipProps[question.status];
                return (
                  <Grid item xs={12} key={question.id}>
                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 200 }}>
                            <Avatar src={author?.avatarUrl}>{author?.name?.[0]}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {author?.name ?? "알 수 없음"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(question.createdAt).toLocaleString("ko-KR")}
                              </Typography>
                            </Box>
                          </Stack>
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            {question.content}
                          </Typography>
                          <Chip
                            label={chipProps.label}
                            color={chipProps.color}
                            variant={question.status === "pending" ? "outlined" : "filled"}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {question.status !== "answered" ? (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => openAnswerDialog(question)}
                            >
                              답변 작성
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openAnswerDialog(question)}
                            >
                              답변 수정
                            </Button>
                          )}
                          {question.status !== "pending" ? (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleStatusChange(question, "pending")}
                            >
                              대기로 이동
                            </Button>
                          ) : null}
                          {question.status !== "in-progress" ? (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleStatusChange(question, "in-progress")}
                            >
                              검토 중으로 표시
                            </Button>
                          ) : null}
                          {question.status !== "answered" && question.answer ? (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleStatusChange(question, "answered")}
                            >
                              답변 완료 처리
                            </Button>
                          ) : null}
                        </Stack>
                        {question.answer ? (
                          <Box
                            sx={{
                              backgroundColor: "rgba(59,130,246,0.08)",
                              borderRadius: 2,
                              p: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              멘토 답변
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {question.answer.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(question.answer.createdAt).toLocaleString("ko-KR")}
                            </Typography>
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(answeringQuestion)}
        onClose={() => setAnsweringQuestion(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>답변 작성</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="답변 내용"
            minRows={4}
            multiline
            fullWidth
            value={answerContent}
            onChange={(event) => setAnswerContent(event.target.value)}
            placeholder="멘티에게 전달할 답변을 작성하세요."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnsweringQuestion(null)}>취소</Button>
          <Button onClick={submitAnswer} variant="contained" disabled={!answerContent.trim()}>
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>새 질문 등록</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <InputLabel id="asking-session">세션</InputLabel>
            <Select
              labelId="asking-session"
              value={askingSessionId ?? ""}
              label="세션"
              onChange={(event) => setAskingSessionId(event.target.value)}
            >
              {sortedSessions.map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="asking-mentee">멘티</InputLabel>
            <Select
              labelId="asking-mentee"
              value={askingMenteeId ?? ""}
              label="멘티"
              onChange={(event) => setAskingMenteeId(event.target.value)}
            >
              {mentees.map((mentee) => (
                <MenuItem key={mentee.id} value={mentee.id}>
                  {mentee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="질문 내용"
            multiline
            minRows={4}
            value={questionContent}
            onChange={(event) => setQuestionContent(event.target.value)}
            placeholder="멘티의 질문을 입력하세요"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialogOpen(false)}>취소</Button>
          <Button
            onClick={submitQuestion}
            variant="contained"
            disabled={!questionContent.trim() || !askingSessionId || !askingMenteeId}
          >
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
