// Next
import Link from "next/link";

// TODO: Landing Page

export default function Page() {
  return (
    <div className="w-full h-svh flex justify-center items-center">
      <Link href="/dashboard" className="text-2xl font-bold">
        Dashboard
      </Link>
    </div>
  );
}
