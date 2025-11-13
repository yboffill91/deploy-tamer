"use client";

import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UnderConstructionPage = () => {
  const router = useRouter();
  const onSignIn = () => {
    router.push("/sign_in");
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <Empty>
          <Image
            src={"/brand/blue-t.webp"}
            alt="TAMERStudio"
            width={1500}
            height={1500}
            className="size-24 rounded-lg  object-contain"
          />
          <h2 className="mt-6 text-2xl font-semibold">
            Something Amazing is Coming
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re working hard to bring you an incredible experience. Stay
            tuned for something special.
          </p>
          <Button onClick={onSignIn} size="lg" className="mt-6">
            Sign In
          </Button>
        </Empty>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
