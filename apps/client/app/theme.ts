"use client";

import { createTheme } from "@mui/material/styles";

/**
 * Premium Pizza House Design System
 *
 * Aesthetic direction: "Modern Italian Trattoria meets Tech-forward Delivery"
 * - Warm, food-forward palette anchored by deep charcoal + amber gold
 * - Sharp typographic hierarchy using Manrope (display) + system stack
 * - Generous whitespace with controlled density on product cards
 * - Micro-interactions throughout: hover lifts, active presses, smooth transitions
 */

const BRAND = {
  gold: "#FAE900",
  goldDark: "#E8D800",
  goldDeep: "#C9BB00",
  charcoal: "#1A1A18",
  charcoalMid: "#2D2D2B",
  ink: "#111110",
  cream: "#FAFAF7",
  surface: "#FFFFFF",
  surfaceMid: "#F5F5F2",
  muted: "#8A8A85",
  border: "rgba(26,26,24,0.08)",
  borderMid: "rgba(26,26,24,0.14)",
  red: "#E8321A",
  green: "#1A7A3C",
};

const theme = createTheme({
  palette: {
    primary: {
      main: BRAND.gold,
      dark: BRAND.goldDark,
      contrastText: BRAND.ink,
    },
    secondary: {
      main: BRAND.charcoal,
      contrastText: "#FFFFFF",
    },
    error: {
      main: BRAND.red,
    },
    success: {
      main: BRAND.green,
    },
    background: {
      default: BRAND.cream,
      paper: BRAND.surface,
    },
    text: {
      primary: BRAND.charcoal,
      secondary: BRAND.muted,
    },
    divider: BRAND.border,
  },
  colorSchemes: {},

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: [
      "Manrope",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.1,
      color: BRAND.charcoal,
    },
    h2: {
      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.1rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h5: { fontSize: "1rem", fontWeight: 600 },
    h6: { fontSize: "0.9rem", fontWeight: 600 },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "-0.005em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
      color: BRAND.muted,
    },
    caption: {
      fontSize: "0.75rem",
      letterSpacing: "0.01em",
      color: BRAND.muted,
    },
    overline: {
      fontSize: "0.7rem",
      letterSpacing: "0.1em",
      fontWeight: 700,
      textTransform: "uppercase",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        
        *, *::before, *::after {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          background-color: ${BRAND.cream};
          color: ${BRAND.charcoal};
        }
        
        ::selection {
          background: ${BRAND.gold};
          color: ${BRAND.ink};
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(26,26,24,0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(26,26,24,0.35);
        }
      `,
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableRipple: false,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: "inherit",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          borderRadius: 12,
          transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": {
            transform: "scale(0.97)",
          },
        },
        containedPrimary: {
          backgroundColor: BRAND.gold,
          color: BRAND.ink,
          "&:hover": {
            backgroundColor: BRAND.goldDark,
            boxShadow: "0 4px 16px rgba(250,233,0,0.4)",
          },
        },
        containedSecondary: {
          backgroundColor: BRAND.charcoal,
          color: "#fff",
          "&:hover": {
            backgroundColor: BRAND.charcoalMid,
            boxShadow: "0 4px 16px rgba(26,26,24,0.25)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
        sizeLarge: {
          padding: "14px 28px",
          fontSize: "1rem",
          borderRadius: 14,
        },
        sizeMedium: {
          padding: "10px 20px",
          fontSize: "0.9rem",
        },
        sizeSmall: {
          padding: "7px 14px",
          fontSize: "0.82rem",
          borderRadius: 10,
        },
      },
    },

    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${BRAND.border}`,
          boxShadow: "none",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(26,26,24,0.10)",
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "inherit",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            fontFamily: "inherit",
            transition: "box-shadow 0.18s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: BRAND.charcoal,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 3px rgba(250,233,0,0.3)`,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: BRAND.charcoal,
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "inherit",
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "inherit",
        },
      },
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
          subtitle1: "p",
          subtitle2: "p",
          body1: "p",
          body2: "p",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: BRAND.border,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: "inherit",
          fontWeight: 700,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: "-8px 0 40px rgba(26,26,24,0.15)",
        },
      },
    },

    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(26,26,24,0.06)",
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(26,26,24,0.04), transparent)",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.18s ease",
          "&:active": {
            transform: "scale(0.93)",
          },
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
  },
});

export default theme;
export { BRAND };
