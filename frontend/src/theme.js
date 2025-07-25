// frontend/src/theme.js

import { extendTheme } from "@chakra-ui/react";

// Ziraat Bankası'nın kurumsal kırmızı rengi
const ziraatRed = "#E01E25";

const theme = extendTheme({
  // 1. Renk Paletini Tanımlama
  colors: {
    ziraatRed: {
      50: "#FEE9E9",
      100: "#F9BDBD",
      200: "#F39192",
      300: "#EE6467",
      400: "#E8383C",
      500: ziraatRed, // Ana rengimiz
      600: "#B3181D",
      700: "#861216",
      800: "#5A0C0E",
      900: "#2D0607",
    },
  },
  // 2. Yazı Tiplerini Tanımlama
  fonts: {
    heading: `'Lato', sans-serif`,
    body: `'Lato', sans-serif`,
  },
  // 3. Genel Sayfa Stillerini Belirleme
  styles: {
    global: {
      body: {
        bg: "gray.50", // Sayfa arkaplanını çok hafif bir gri yapalım
        color: "gray.800",
      },
    },
  },
});

export default theme;