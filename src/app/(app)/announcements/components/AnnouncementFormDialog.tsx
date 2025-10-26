import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { Announcement } from "@/types/domain";

type FormField = "title" | "content" | "audience" | "actionUrl";

interface AnnouncementFormDialogProps {
  open: boolean;
  title: string;
  content: string;
  audience: Announcement["audience"];
  actionUrl: string;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: FormField, value: string) => void;
}

export function AnnouncementFormDialog({
  open,
  title,
  content,
  audience,
  actionUrl,
  onClose,
  onSubmit,
  onChange,
}: AnnouncementFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>새 공지 작성</DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="제목"
          value={title}
          onChange={(event) => onChange("title", event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="내용"
          value={content}
          onChange={(event) => onChange("content", event.target.value)}
          multiline
          minRows={4}
          required
        />
        <FormControl>
          <InputLabel id="audience-label">대상</InputLabel>
          <Select
            labelId="audience-label"
            value={audience}
            label="대상"
            onChange={(event) => onChange("audience", event.target.value as Announcement["audience"])}
          >
            <MenuItem value="mentees">멘티</MenuItem>
            <MenuItem value="mentors">멘토</MenuItem>
            <MenuItem value="all">전체</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="연결 링크 (선택)"
          value={actionUrl}
          onChange={(event) => onChange("actionUrl", event.target.value)}
          placeholder="https://..."
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!title.trim() || !content.trim()}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
