import { Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleRounded";
import { PageHeader } from "@/components/common/PageHeader";
import { CtaButton } from "@/components/common/CtaButton";

interface AnnouncementHeaderProps {
  onOpenDialog: () => void;
}

export function AnnouncementHeader({ onOpenDialog }: AnnouncementHeaderProps) {
  return (
    <PageHeader
      title="공지"
      description="멘티와 멘토에게 전달할 공지를 작성하고 관리하세요."
      sx={{
        alignItems: { xs: "flex-start", md: "flex-end" },
        mt: { xs: 3, md: 4 },
        mb: { xs: 3, md: 4 },
        rowGap: 1.5,
      }}
      actionsWrapperSx={{
        alignItems: "center",
      }}
      actions={(
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <CtaButton
            label="새 공지 작성"
            startIcon={<AddIcon />}
            onClick={onOpenDialog}
            sx={{ minWidth: { sm: 160 } }}
          />
        </Stack>
      )}
    />
  );
}
