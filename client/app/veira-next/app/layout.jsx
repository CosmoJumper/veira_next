import { AppProviders } from "./providers/app-providers";
import "./globals.css";

export const metadata = {
  title: "VEIRA",
  description: "Натуральные продукты для здоровья в Казахстане",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
