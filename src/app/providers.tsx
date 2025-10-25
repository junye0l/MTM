"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthSessionProvider } from "@/context/AuthSessionContext";
import { MentorshipProvider } from "@/context/MentorshipContext";
import { muiTheme } from "@/theme";

interface ProvidersProps {
  children: ReactNode;
  initialSession: Session | null;
}

export function Providers({ children, initialSession }: ProvidersProps) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthSessionProvider initialSession={initialSession}>
          <MentorshipProvider>{children}</MentorshipProvider>
        </AuthSessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
