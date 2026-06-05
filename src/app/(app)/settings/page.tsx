import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { PasswordForm } from "@/components/password-form";
import { Lock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your security preferences.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Lock className="h-4 w-4 text-slate-400" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PasswordForm />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
