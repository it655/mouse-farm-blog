import type { Config } from "tailwindcss";

const config: Config = {
  // 👇👇👇 KIỂM TRA KỸ MỤC NÀY
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Nếu bạn có folder 'lib' hay 'utils' chứa component thì thêm vào:
    // "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Các màu custom của bạn (nếu có)
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;