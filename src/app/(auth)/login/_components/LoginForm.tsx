"use client";

import NextLink from "next/link";
import { startTransition, useActionState } from "react";
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
import { useForm, type SubmitHandler } from "react-hook-form";
import { type AuthActionState, loginAction } from "../../actions";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const initialState: AuthActionState = { status: "idle" };
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    const formData = new FormData();
    formData.append("email", values.email.trim());
    formData.append("password", values.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardHeader
        title="다시 만나 반가워요"
        subheader="계정으로 로그인해 멘토링 허브에 참여하세요."
      />
      <CardContent>
        <Stack
          component="form"
          spacing={3}
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {state.status === "error" && (
            <Alert severity="error" sx={{ bgcolor: "rgba(244, 67, 54, 0.08)" }}>
              {state.message}
            </Alert>
          )}
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            fullWidth
            required
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
            autoComplete="current-password"
            fullWidth
            required
            disabled={pending}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다.",
              },
            })}
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
