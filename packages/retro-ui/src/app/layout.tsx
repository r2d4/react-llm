import React from "react";

export const metadata = {
  title: "Local LLM Chat",
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
    </html>
  );
}
