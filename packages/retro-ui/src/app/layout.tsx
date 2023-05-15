import Script from "next/script";
import React from "react";
import "../styles/globals.css";

export const metadata = {
  title: "AI Instant Messenger",
  description: "Chat with an in-browser Vicuna LLM model",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundImage: `url("xp.jpeg")`,
        }}
      >
        {children}
      </body>
      <Script
        id={"google-analytics"}
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
page_path: window.location.pathname,
});
`,
        }}
      />
    </html>
  );
}
