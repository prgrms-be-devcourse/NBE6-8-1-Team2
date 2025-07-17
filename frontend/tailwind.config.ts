import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 실제 경로
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],       // 기본 본문용
        title: ["var(--font-montserrat)", "sans-serif"], // 헤더 제목용
      },
    },
  },
  plugins: [],
};

export default config;