import type { Metadata } from "next";
import RegisterForm from "@/components/sections/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register for APL Season 3 — Join 12 teams, 64 players. Opening 14·06·2026 at Akshar Arena.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
