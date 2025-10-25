"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";

const navItems = [
  { label: "일정", href: "/sessions" },
  { label: "출석", href: "/attendance" },
  { label: "질문", href: "/questions" },
  { label: "공지", href: "/announcements" },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const currentTab = navItems.find((item) => pathname.startsWith(item.href))?.href ?? false;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Toolbar disableGutters sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, sm: 64 }, gap: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700}>
            MTM
          </Typography>
          <Tabs
            value={currentTab}
            aria-label="MTM navigation"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              flexGrow: 1,
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
              },
            }}
          >
            {navItems.map((item) => (
              <Tab
                key={item.href}
                component={Link}
                href={item.href}
                value={item.href}
                label={item.label}
                disableRipple
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
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
