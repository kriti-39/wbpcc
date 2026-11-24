import "../globals.css";
import "./console.css";
import { fontClasses } from "../fonts";
import ConsoleShell from "@/components/console/ConsoleShell";

// The team console is its own app (its own root layout): no public header,
// footer or pop-ups. English-only for now; console languages can come later.
export const metadata = {
  title: { default: "Team console · WBPCC", template: "%s · Team console · WBPCC" },
  robots: { index: false, follow: false },
  icons: { icon: "/brand/logo.svg" },
};

export const viewport = { themeColor: "#15223f" };

export default function ConsoleLayout({ children }) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="cs-body">
        <ConsoleShell>{children}</ConsoleShell>
      </body>
    </html>
  );
}
