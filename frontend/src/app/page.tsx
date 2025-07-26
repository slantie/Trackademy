/**
 * @file src/app/page.tsx
 * @description Root page that redirects to home
 */

import { redirect } from "next/navigation";

export default function RootPage() {
    redirect("/home");
}
