import Link from "next/link";

export default function CTA() {
  return (
    <section id="register" className="bg-green-600 py-24 text-center text-white">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="mb-4 text-4xl font-extrabold">Ready to play?</h2>
        <p className="mb-10 text-green-100">
          Join hundreds of teams already registered for this season.
        </p>
        <Link
          href="/register"
          className="rounded-full bg-white px-10 py-4 font-bold text-green-700 transition hover:bg-green-50"
        >
          Register Your Team
        </Link>
      </div>
    </section>
  );
}
