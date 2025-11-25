import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,

  colors: {
    brand: {
      50: "#ecf1ff",
      100: "#c5d4ff",
      200: "#9fb7ff",
      300: "#789aff",
      400: "#527dff",
      500: "#295fff",
      600: "#1f4ad1",
      700: "#1536a3",
      800: "#0b2275",
      900: "#020d47",
    },
    accent: {
      50: "#ffe3eb",
      100: "#ffb3c7",
      200: "#ff82a3",
      300: "#ff5180",
      400: "#ff1f5c",
      500: "#e60043",
      600: "#b40034",
      700: "#820025",
      800: "#500016",
      900: "#200008",
    },
    glow: "#4f8cff",
  },

  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },

  shadows: {
    outline: "0 0 0 3px rgba(82, 125, 255, 0.6)",
    neon: "0 0 20px rgba(82,125,255,0.85)",
    pink: "0 0 15px rgba(255, 31, 92, 0.7)",
    card: "0 8px 30px rgba(0,0,0,0.35)",
  },

  radii: {
    none: "0",
    sm: "6px",
    md: "12px",
    lg: "18px",
    xl: "25px",
    full: "9999px",
  },

  transition: {
    fast: "all 0.15s ease",
    normal: "all 0.25s ease",
    slow: "all 0.35s ease",
  },

  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
        fontSmooth: "always",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },

      a: {
        color: "brand.400",
        transition: "0.2s ease",
        _hover: {
          color: "brand.200",
          textShadow: "0px 0px 8px #295fff",
        },
      },

      ".glass-card": {
        backdropFilter: "blur(14px)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
      },

      ".anime-card:hover": {
        transform: "scale(1.04)",
        boxShadow: "0 0 25px rgba(41,95,255,0.8)",
        transition: "0.25s",
      },
    },
  },

  components: {
    Toast: {
      variants: {
        sugAnime: {
          container: {
            bg: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(82,125,255,0.45)",
            boxShadow: "0 0 25px rgba(82,125,255,0.55)",
            color: "white",
            borderRadius: "16px",
            padding: "14px 18px",
          }
        }
      }
    },
    Button: {
      baseStyle: {
        borderRadius: "12px",
        fontWeight: "600",
        _hover: {
          transform: "scale(1.05)",
          boxShadow: "0 0 14px rgba(82,125,255,0.7)",
        },
        _active: {
          transform: "scale(0.97)",
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.400" },
        },
        accent: {
          bg: "accent.500",
          color: "white",
          _hover: { bg: "accent.400" },
        },
      },
    },

  },
});

export default theme;