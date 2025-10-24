import { Button } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";

export default function MessagePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background ">
      <div className="text-center space-y-4 w-fullborder rounded-lg ">
        <h1 className="text-4xl font-semibold text-balance">
          We are developing this page
        </h1>
        <p className="text-lg text-muted-foreground text-pretty"></p>
        <Link href={"/sign_in"}>
          <Button>Sign In</Button>
        </Link>
        <Image
          src={"/brand/blue_tamerdigital.webp"}
          alt="tamerdigital"
          width={1200}
          height={1200}
          className="h-32  w-auto  absolute top-0 left-1/2 -translate-x-1/2  object-center"
        />
      </div>
    </div>
  );
}
