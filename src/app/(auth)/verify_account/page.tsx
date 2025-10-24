import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OTPForm } from "@/modules/auth/components/OTPForm";

export default function OTPVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-balance flex items-center gap-2">
            Verify Account
          </CardTitle>
          <CardDescription>
            We sent a verification code to your email. Please check your inbox
            and enter the code below.
          </CardDescription>
        </CardHeader>

        <OTPForm />
      </Card>
    </div>
  );
}
