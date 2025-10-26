import { Box, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import EventAvailableIcon from "@mui/icons-material/EventAvailableRounded";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswerRounded";
import CampaignIcon from "@mui/icons-material/CampaignRounded";
import GroupIcon from "@mui/icons-material/GroupsRounded";
import type { ReactNode } from "react";

export type LandingFeature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const defaultFeatures: LandingFeature[] = [
  {
    title: "일정·세션 자동 정리",
    description:
      "태그·아젠다·자료를 한 번에 입력하고, 멘티별 참석 정보를 실시간으로 공유합니다.",
    icon: <EventAvailableIcon color="primary" fontSize="large" />,
  },
  {
    title: "질문 답변 히스토리",
    description:
      "멘티 질문, 답변 여부, 투표 수를 시간 순으로 추적해 회차별 학습 흐름을 파악합니다.",
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

interface FeatureHighlightsProps {
  features?: LandingFeature[];
}

export function FeatureHighlights({ features = defaultFeatures }: FeatureHighlightsProps) {
  return (
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
  );
}
