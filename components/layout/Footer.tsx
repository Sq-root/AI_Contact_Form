import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-apl-line bg-apl-ink py-6 text-center md:py-8">
      <p className="font-mono leading-[1.8] tracking-[1.5px] text-apl-muted text-[9px] md:text-[10px]">
        © <span className="uppercase">{APL_SEASON.leagueName}</span> ·{" "}
        <span className="text-apl-yellow">SEASON {APL_SEASON.number}</span>
        <br />
        WHERE CRICKET MEETS CHARACTER
      </p>
      <Link
        href="/admin"
        className="mt-3 inline-block font-mono text-[9px] tracking-[2px] text-white/25 transition hover:text-apl-yellow"
      >
        ADMIN
      </Link>
    </footer>
  );
}
