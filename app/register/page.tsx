import type { Metadata } from "next";
import RegisterForm from "@/components/sections/RegisterForm";
import { APL_SEASON } from "@/lib/constants";

const seasonNum = parseInt(APL_SEASON.number, 10);

export const metadata: Metadata = {
  title: "Register",
  description: `Register for ${APL_SEASON.leagueShort} Season ${seasonNum} — ${APL_SEASON.teams} teams, ${APL_SEASON.players} players. Opening ${APL_SEASON.opening} at ${APL_SEASON.venue}.`,
};

export default function RegisterPage() {
  return <RegisterForm />;
}
