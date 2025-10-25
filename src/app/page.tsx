import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import EventAvailableIcon from "@mui/icons-material/EventAvailableRounded";
import GroupIcon from "@mui/icons-material/GroupsRounded";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswerRounded";
import CampaignIcon from "@mui/icons-material/CampaignRounded";
import { TopNav } from "@/components/layout/TopNav";
import { createSupabaseServerClient } from "@/lib/supabaseServerClient";

const features = [
  {
    title: "일정·세션 자동 정리",
    description: "태그·아젠다·자료를 한 번에 입력하고, 멘티별 참석 정보를 실시간으로 공유합니다.",
    icon: <EventAvailableIcon color="primary" fontSize="large" />,
  },
  {
    title: "질문 답변 히스토리",
    description: "멘티 질문, 답변 여부, 투표 수를 시간 순으로 추적해 회차별 학습 흐름을 파악합니다.",
    icon: <QuestionAnswerIcon color="primary" fontSize="large" />,
  },
  {
    title: "공지·알림 송신",
    description: "멘토·멘티 대상 별 공지를 작성하고, 필요한 리소스를 빠르게 링크할 수 있습니다.",
    icon: <CampaignIcon color="primary" fontSize="large" />,
  },
  {
    title: "팀 운영 데이터",
    description: "출석률, 세션 참여, 활동 로그 등을 기반으로 멘토링 품질을 모니터링합니다.",
    icon: <GroupIcon color="primary" fontSize="large" />,
  },
];

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
                MTM Mentorship Hub
              </Typography>
              <Typography variant="h3" fontWeight={700} lineHeight={1.25}>
                멘토링 일정·출석·질문을
                <br /> 한 번에 관리하는 운영 도구
              </Typography>
              <Typography variant="body1" color="text.secondary">
                세션 스케줄, 멘티 출석, 질문/답변, 공지를 각각 다른 도구로 관리하고 있나요? MTM
                Mentorship Hub는 멘토링 운영 흐름을 한 화면으로 모아 팀 커뮤니케이션을 더 가볍게
                만들어 줍니다.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button
                  component={Link}
                  href={primaryHref}
                  size="large"
                  variant="contained"
                  sx={{ minWidth: 200, textTransform: "none" }}
                >
                  {primaryLabel}
                </Button>
                <Button
                  component={Link}
                  href={secondaryHref}
                  size="large"
                  variant="outlined"
                  sx={{ minWidth: 200, textTransform: "none" }}
                >
                  {secondaryLabel}
                </Button>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Stack>
                  <Typography variant="h4" fontWeight={700}>
                    92%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 세션 참석률
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h4" fontWeight={700}>
                    120+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    누적 질문/답변
                  </Typography>
                </Stack>
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

          <Box mt={12}>
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
              멘토링 운영에 꼭 필요한 기능
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature) => (
                <Grid item xs={12} sm={6} md={3} key={feature.title}>
                  <Card sx={{ height: "100%", borderRadius: 3 }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>{feature.icon}</Box>
                      <Typography variant="h6" fontWeight={700}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
