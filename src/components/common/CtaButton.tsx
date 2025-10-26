import Link from "next/link";
import { Button, type ButtonProps, type SxProps, type Theme } from "@mui/material";

type BaseProps<Comp extends React.ElementType> = Omit<ButtonProps<Comp>, "children" | "variant" | "sx"> & {
  label: string;
  variant?: "primary" | "secondary";
  sx?: SxProps<Theme>;
};

type LinkButtonProps = BaseProps<"a"> & { href: string };
type PlainButtonProps = BaseProps<"button"> & { href?: undefined };

export type CtaButtonProps = LinkButtonProps | PlainButtonProps;

export function CtaButton({ label, variant = "primary", href, sx, ...rest }: CtaButtonProps) {
  const commonStyles: SxProps<Theme> = { 
    minWidth: { xs: "100%", sm: 160 }, 
    textTransform: "none", 
    ...(sx || {}) 
  };

  return (
    <Button
      component={href ? Link : "button"}
      href={href}
      size="large"
      variant={variant === "primary" ? "contained" : "outlined"}
      sx={commonStyles}
      {...rest}
    >
      {label}
    </Button>
  );
}
