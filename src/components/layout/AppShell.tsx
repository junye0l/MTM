import { type ReactNode } from "react";
import { Box } from "@mui/material";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <TopNav variant="dashboard" />
      <Box
        component="main"
        sx={{
          pt: { xs: 9, sm: 10 },
          px: { xs: 2.5, md: 4 },
          pb: { xs: 5, md: 6 },
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
