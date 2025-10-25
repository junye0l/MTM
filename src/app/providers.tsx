"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";
import { MentorshipProvider } from "@/context/MentorshipContext";
import { muiTheme } from "@/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <MentorshipProvider>{children}</MentorshipProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
