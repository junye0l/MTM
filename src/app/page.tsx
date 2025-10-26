import { Box, Card, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { TopNav } from "@/components/layout/TopNav";
import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import { FeatureHighlights } from "./(landing)/components/FeatureHighlights";
import { CtaButton } from "@/components/common/CtaButton";

export default async function LandingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const primaryHref = session ? "/sessions" : "/login";
  const secondaryHref = session ? "/announcements" : "/signup";
  const primaryLabel = session ? "대시보드로 이동" : "지금 시작하기";
  const secondaryLabel = session ? "공지 살펴보기" : "무료로 가입하기";

  return (
    <>
      <TopNav variant="landing" />
      <Box component="main" sx={{ pt: { xs: 12, md: 14 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="overline" color="primary" fontWeight={600}>
                  Mentorship Hub
                </Typography>
                <Typography variant="h3" fontWeight={700} lineHeight={1.25}>
                  멘토링 일정·출석·질문을
                  <Box component="span" display="block">
                    한 번에 관리하는 운영 도구
                  </Box>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <Box component="span" display="block">
                    세션 스케줄, 멘티 출석, 질문/답변, 공지를 각각 다른 도구로 관리하고 있나요?
                  </Box>
                  <Box component="span" display="block">
                    MTM Mentorship Hub는 멘토링 운영 흐름을 한 화면으로 모아 팀 커뮤니케이션을 더 가볍게 만들어 줍니다.
                  </Box>
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <CtaButton label={primaryLabel} href={primaryHref} />
                  <CtaButton label={secondaryLabel} href={secondaryHref} variant="secondary" />
                </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                color: "white",
                minHeight: { xs: 280, md: 360 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: { xs: 4, md: 5 },
                boxShadow: 8,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.85 }}>
                운영 인사이트
              </Typography>
              <Typography variant="h5" fontWeight={700} mt={1}>
                한눈에 보는 멘토링 스냅샷
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9, maxWidth: 480 }}>
                다음 세션 일정, 참석 예정 멘티, 답변 대기 질문을 실시간으로 확인하고 공지까지 바로
                보낼 수 있습니다. 데이터를 모으느라 시간을 쓰지 말고, 멘토링 자체에 집중하세요.
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.08)",
                  p: 3,
                  display: "grid",
                  gap: 2,
                }}
              >
                {["다가오는 세션 2건", "답변 대기 질문 4건", "공지 발송 1건"].map((item) => (
                  <Typography key={item} variant="body2">
                    • {item}
                  </Typography>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

          <FeatureHighlights />
        </Container>
      </Box>
    </>
  );
}
