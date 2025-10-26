"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/context/AuthSessionContext";
import { logoutAction } from "@/app/(auth)/actions";

const navItems = [
  { label: "일정", href: "/sessions" },
  { label: "출석", href: "/attendance" },
  { label: "질문", href: "/questions" },
  { label: "공지", href: "/announcements" },
];

interface TopNavProps {
  variant: "landing" | "dashboard";
}

export function TopNav({ variant }: TopNavProps) {
  const pathname = usePathname();
  const { user, loading, setSessionValue } = useAuthSession();
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isLoggingOut, startLogout] = useTransition();
  const currentTab = useMemo(() => {
    if (variant !== "dashboard") return false;
    return navItems.find((item) => pathname.startsWith(item.href))?.href ?? false;
  }, [pathname, variant]);

  const avatarInitial =
    user?.user_metadata?.name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "M";
  const avatarSrc = (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url;
  const isMenuOpen = Boolean(menuAnchor);

  const handleLogout = () => {
    setMenuAnchor(null);
    startLogout(async () => {
      await logoutAction();
      setSessionValue(null);
      router.refresh();
    });
  };

  const actionNode = user ? (
    <>
      <IconButton
        size="small"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        sx={{ p: 0 }}
        aria-label="프로필 메뉴 열기"
      >
        <Avatar
          src={avatarSrc}
          alt={user.email ?? "사용자"}
          sx={{ width: 40, height: 40, fontWeight: 600, bgcolor: "primary.main", color: "white" }}
        >
          {avatarSrc ? null : avatarInitial}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={() => setMenuAnchor(null)}
        slotProps={{
          paper: {
            elevation: 4,
            sx: { minWidth: 220, mt: 1 },
          },
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          내 프로필 (준비 중)
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{ color: "error.main", fontWeight: 600 }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </MenuItem>
      </Menu>
    </>
  ) : (
    <Button
      component={Link}
      href="/login"
      variant="contained"
      size="medium"
      disableElevation
      sx={{ textTransform: "none", minWidth: 120 }}
      disabled={loading}
    >
      {loading ? "확인 중..." : "로그인"}
    </Button>
  );

  return (
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
      <Toolbar disableGutters sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, sm: 64 } }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          component={Link}
          href="/"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h6" fontWeight={800}>
            MTM
          </Typography>
        </Stack>
        {variant === "dashboard" ? (
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
              ml: { xs: 1.5, md: 4 },
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
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>{actionNode}</Box>
      </Toolbar>
    </AppBar>
  );
}
