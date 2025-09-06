import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground text-foreground">
      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
