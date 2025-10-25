"use client";

import NextLink from "next/link";
import { useActionState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type AuthActionState, loginAction } from "../actions";

export function LoginForm() {
  const initialState: AuthActionState = { status: "idle" };
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardHeader
        title="다시 만나 반가워요"
        subheader="계정으로 로그인해 멘토링 허브에 참여하세요."
      />
      <CardContent>
        <Stack
          component="form"
          action={formAction}
          spacing={3}
          noValidate
          sx={{ mt: 1 }}
        >
          {state.status === "error" && (
            <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.08)" }}>
              {state.message}
            </Alert>
          )}
          <TextField
            required
            name="email"
            label="이메일"
            type="email"
            autoComplete="email"
            fullWidth
          />
          <TextField
            required
            name="password"
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            fullWidth
          />
          <Button
            size="large"
            variant="contained"
            type="submit"
            disabled={pending}
            sx={{ textTransform: "none" }}
          >
            {pending ? "로그인 중..." : "로그인"}
          </Button>
        </Stack>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            아직 계정이 없나요?{" "}
            <Link component={NextLink} href="/signup" underline="hover">
              가입하기
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
