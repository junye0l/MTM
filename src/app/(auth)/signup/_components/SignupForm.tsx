"use client";

import NextLink from "next/link";
import { startTransition, useActionState } from "react";
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
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { UserRole } from "@/types/domain";
import { type AuthActionState, signupAction } from "../../actions";

const ROLE_OPTIONS: Array<{ value: UserRole; label: string; helper: string }> = [
  { value: "mentee", label: "멘티", helper: "멘토링을 신청하고 공부 기록을 남기는 계정" },
  { value: "mentor", label: "멘토", helper: "세션을 만들고 멘티를 관리하는 계정" },
  { value: "admin", label: "관리자", helper: "운영/관리 목적의 계정" },
];

type SignupFormValues = {
  role: UserRole;
  name: string;
  organization: string;
  email: string;
  password: string;
};

export function SignupForm() {
  const initialState: AuthActionState = { status: "idle" };
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      role: "mentee",
      name: "",
      organization: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (values) => {
    const formData = new FormData();
    formData.append("role", values.role);
    formData.append("name", values.name.trim());
    formData.append("organization", values.organization.trim());
    formData.append("email", values.email.trim());
    formData.append("password", values.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardHeader
        title="새 계정 만들기"
        subheader="역할을 선택하고 기본 정보를 입력해 주세요."
      />
      <CardContent>
        <Stack
          component="form"
          spacing={3}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {state.status === "error" && (
            <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.08)" }}>
              {state.message}
            </Alert>
          )}
          <Controller
            name="role"
            control={control}
            rules={{ required: "역할을 선택해 주세요." }}
            render={({ field }) => (
              <TextField
                select
                label="역할"
                fullWidth
                disabled={pending}
                error={Boolean(errors.role)}
                helperText={
                  errors.role?.message ??
                  ROLE_OPTIONS.find((option) => option.value === field.value)?.helper ??
                    ""
                }
                {...field}
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="이름 또는 닉네임"
            fullWidth
            required
            disabled={pending}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register("name", {
              required: "이름 또는 닉네임을 입력해 주세요.",
              minLength: {
                value: 2,
                message: "이름은 최소 2자 이상이어야 합니다.",
              },
            })}
          />
          <TextField
            label="소속 (선택)"
            placeholder="학교, 회사 등"
            fullWidth
            disabled={pending}
            {...register("organization")}
          />
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            required
            fullWidth
            disabled={pending}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email", {
              required: "이메일을 입력해 주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 주소를 입력해 주세요.",
              },
            })}
          />
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            required
            fullWidth
            disabled={pending}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상이어야 합니다.",
              },
            })}
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
