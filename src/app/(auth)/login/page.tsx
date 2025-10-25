import { Box, Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인 | MTM",
  description: "MTM 멘토링 허브에 로그인하세요.",
};

export default function LoginPage() {
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
        <Box>
          <Typography variant="overline" color="primary" fontWeight={600}>
            MTM Mentorship
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={1}>
            다시 만나 반가워요 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            계정으로 로그인하고 세션, 질문, 공지사항을 한 곳에서 관리하세요.
          </Typography>
        </Box>
        <LoginForm />
      </Stack>
    </Container>
  );
}
