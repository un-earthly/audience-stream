import { SignInForm } from "./signin-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}