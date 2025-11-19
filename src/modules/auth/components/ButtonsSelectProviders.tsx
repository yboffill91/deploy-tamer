"use client";
import { CustomLoading } from "@/components/CustomLoading";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "../";
import { showToast } from "@/components/CustomToaster";

export const ButtonsSelectProviders = ({
  loadingMessage,
}: {
  loadingMessage: string;
}) => {
  const { loginWithProvider, error, loading } = useAuth();

  const onClickloginWithProvider = async (provider: "google" | "facebook") => {
    await loginWithProvider(provider);
  };
  return (
    <>
      <div className={cn("relative")}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid  gap-4">
        <Button
          variant="outline"
          className={cn(
            "w-full",
            loading && "bg-muted text-muted-foreground/80 pointer-events-none"
          )}
          onClick={() => onClickloginWithProvider("google")}
        >
          {loading ? (
            <CustomLoading message={loadingMessage} />
          ) : (
            <>
              <Image
                src={"/logos/google.svg"}
                width={64}
                height={64}
                alt=""
                className="size-4"
              />
              Google
            </>
          )}
        </Button>
        {/* <Button
          variant='outline'
          className={cn(
            'w-full',
            loading && 'bg-muted text-muted-foreground/80 pointer-events-none'
          )}
          onClick={async () => await onClickloginWithProvider('facebook')}
        >
          {loading ? (
            <CustomLoading message={loadingMessage} />
          ) : (
            <>
              <Image
                src={'/logos/facebook.svg'}
                width={64}
                height={64}
                alt=''
                className='size-4'
              />
              Facebook
            </>
          )}
        </Button> */}
      </div>
      {error &&
        showToast({
          message: "Error",
          description: error,
          type: "error",
        })}
    </>
  );
};
