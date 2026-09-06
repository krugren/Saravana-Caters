"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError(null);
    
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
    }, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (ctx) => {
        setError(ctx.error.message || "An error occurred during login.");
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 bg-forest-green text-white">
        <div className="max-w-md">
          <ChefHat className="w-16 h-16 text-primary-container mb-8" />
          <h1 className="font-display text-5xl font-bold mb-4">Saravana Caters</h1>
          <p className="text-xl text-white/80 font-sans mb-8">
            Operations Platform for seamless event management and catering logistics.
          </p>
          <p className="font-tamil text-lg text-gold">
            உங்கள் நம்பிக்கைக்குரிய உணவு சேவை.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-outline/20 shadow-none">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-display text-on-surface">Welcome back</CardTitle>
            <CardDescription className="text-on-surface-variant">
              Enter your credentials to access the operations platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@saravanacaters.com"
                  {...form.register("email")}
                  className="bg-surface-container-low"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-error">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="bg-surface-container-low"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-error">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm border border-error/20">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
