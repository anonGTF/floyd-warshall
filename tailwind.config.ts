import type { Config } from 'tailwindcss'
import daisyui from "daisyui"
import daisyuiTheme from "daisyui/src/theming/themes"

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        "content-primary": "#1A1A1A",
        "content-secondary": "#666666",
        "content-non-essential": "#999999",
        "content-dark-blue": "#121C52",
        "content-success": "#2DC653",
        "content-error": "#EE3D30",
        "background-secondary": "#F2F1F6",
        "background-gray": "#EDEDED",
        "background-blue": "#415CE7",
        "border-primary": "#D9D9D9",
        "border-divider": "#E5E5E5",
        "sentiment-light-green": "#C8FFD5",
        "gray-5": "#E2E6EB",
        "white": "#FFFFFF"
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiTheme["light"],
          primary: "#E36414",      
          secondary: "#121C52",         
          accent: "#F2F1F6",      
          "base-100": "#FFFFFF",
          success: "#2DC653",        
          error: "#EE3D30",
        },
      },
    ]
  }
} satisfies Config