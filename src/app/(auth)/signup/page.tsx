import { Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { SignupForm } from "./_components/SignupForm";

export const metadata: Metadata = {
  title: "회원가입 | MTM",
  description: "MTM 멘토링 허브 계정을 생성하세요.",
};

export default function SignupPage() {
  return (
    <Container
      component="section"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Stack spacing={4} sx={{ width: "100%" }}>
        <div>
          <Typography variant="overline" color="primary" fontWeight={600}>
            MTM Mentorship
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={1}>
            새로운 여정을 시작해요 🚀
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            역할을 선택하고 정보를 입력하면 바로 멘토링 공간을 사용할 수 있어요.
          </Typography>
        </div>
        <SignupForm />
      </Stack>
    </Container>
  );
}
