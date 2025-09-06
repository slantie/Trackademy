import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header className="sticky top-0 z-50" />
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
