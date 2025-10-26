"use client";

import { Box, Stack, Typography, type BoxProps, type StackProps } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  sx?: StackProps["sx"];
  actionsWrapperSx?: BoxProps["sx"];
}

export function PageHeader({ title, description, actions, sx, actionsWrapperSx }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      spacing={description ? 2 : 1.5}
      sx={{ width: "100%", ...sx }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}

      </Box>
      {actions ? (
        <Box
          sx={{
            width: { xs: "100%", md: "auto" },
            display: "flex",
            justifyContent: { xs: "stretch", md: "flex-end" },
            ...actionsWrapperSx,
          }}
        >
          {actions}
        </Box>
      ) : null}
    </Stack>
  );
}
