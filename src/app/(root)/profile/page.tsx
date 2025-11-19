"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/modules/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign_in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.photoURL} alt={user?.displayName} />
              <AvatarFallback className="text-2xl">
                {user?.displayName ? user.email![0].toLocaleUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{user?.displayName}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              className="w-full bg-transparent"
              variant="outline"
              size="lg"
              onClick={handleLogout}
            >
              Logout <LogOut />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
