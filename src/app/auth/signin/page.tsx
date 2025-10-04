"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { FormikInput } from "@/components/ui/FormikInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

const signInSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface SignInForm {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initialValues: SignInForm = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: SignInForm, { setSubmitting }: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={signInSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormikInput
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  icon={<Mail className="h-4 w-4" />}
                />

                <FormikInput
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  icon={<Lock className="h-4 w-4" />}
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading || isSubmitting}
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Sign in
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2 h-4 w-4" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
