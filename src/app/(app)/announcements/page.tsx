"use client";

import { useState } from "react";
import type { Announcement } from "@/types/domain";
import { useMentorship } from "@/context/MentorshipContext";
import { AnnouncementHeader } from "./components/AnnouncementHeader";
import { AnnouncementList } from "./components/AnnouncementList";
import { AnnouncementFormDialog } from "./components/AnnouncementFormDialog";

export default function AnnouncementsPage() {
  const {
    state: { announcements },
    dispatch,
  } = useMentorship();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>("mentees");
  const [actionUrl, setActionUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAudience("mentees");
    setActionUrl("");
  };

  const handleChange = (field: "title" | "content" | "audience" | "actionUrl", value: string) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      case "audience":
        setAudience(value as Announcement["audience"]);
        break;
      case "actionUrl":
        setActionUrl(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    dispatch({
      type: "ADD_ANNOUNCEMENT",
      payload: {
        title: title.trim(),
        content: content.trim(),
        audience,
        actionUrl: actionUrl.trim() || undefined,
      },
    });
    resetForm();
    setDialogOpen(false);
  };

  return (
    <>
      <AnnouncementHeader onOpenDialog={() => setDialogOpen(true)} />
      <AnnouncementList announcements={announcements} />
      <AnnouncementFormDialog
        open={dialogOpen}
        title={title}
        content={content}
        audience={audience}
        actionUrl={actionUrl}
        onClose={() => {
          resetForm();
          setDialogOpen(false);
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </>
  );
}
