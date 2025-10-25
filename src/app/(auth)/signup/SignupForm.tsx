"use client";

import NextLink from "next/link";
import { useActionState, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { UserRole } from "@/types/domain";
import { type AuthActionState, signupAction } from "../actions";

const ROLE_OPTIONS: Array<{ value: UserRole; label: string; helper: string }> = [
  { value: "mentee", label: "멘티", helper: "멘토링을 신청하고 공부 기록을 남기는 계정" },
  { value: "mentor", label: "멘토", helper: "세션을 만들고 멘티를 관리하는 계정" },
  { value: "admin", label: "관리자", helper: "운영/관리 목적의 계정" },
];

export function SignupForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("mentee");
  const initialState: AuthActionState = { status: "idle" };
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardHeader
        title="새 계정 만들기"
        subheader="역할을 선택하고 기본 정보를 입력해 주세요."
      />
      <CardContent>
        <Stack component="form" action={formAction} spacing={3} noValidate>
          {state.status === "error" && (
            <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.08)" }}>
              {state.message}
            </Alert>
          )}
          <TextField
            select
            name="role"
            label="역할"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value as UserRole)}
            helperText={
              ROLE_OPTIONS.find((option) => option.value === selectedRole)?.helper ?? ""
            }
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField name="name" label="이름 또는 닉네임" required fullWidth />
          <TextField
            name="organization"
            label="소속 (선택)"
            placeholder="학교, 회사 등"
            fullWidth
          />
          <TextField
            name="email"
            label="이메일"
            type="email"
            autoComplete="email"
            required
            fullWidth
          />
          <TextField
            name="password"
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={pending}
            sx={{ textTransform: "none" }}
          >
            {pending ? "가입 중..." : "가입하기"}
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={3}>
          이미 계정이 있나요?{" "}
          <Link component={NextLink} href="/login" underline="hover">
            로그인하기
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
