import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Logo from "@/components/logo";
import { loginBaseSchema, type LoginBaseSchema } from "@/lib/validations/login";
import { useAuth } from "@/providers/auth";
import { Loader2 } from "lucide-react";
import useDelayedSpinner from "@/hooks/useDelayedSpinner";
import { toast } from "sonner";

function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showSpinner, startSpinner, stopSpinner } = useDelayedSpinner(500);
  const form = useForm<LoginBaseSchema>({
    resolver: zodResolver(loginBaseSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  async function onSubmit(values: LoginBaseSchema) {
    setIsLoading(true);
    startSpinner();

    try {
      await login(values.email, values.password);
      navigate({ to: "/", from: "/auth/login" });
      toast.success("Zalogowano pomyślnie");
    } catch (error) {
      if ((error as Error).message.includes("401")) {
        const formError = {
          type: "server",
          message: "Nieprawidłowe dane uwierzytelniające",
        };

        form.setError("email", formError);
        form.setError("password", formError);
      } else {
        toast.error("Coś poszło nie tak spróbuj ponownie");
      }
    } finally {
      setIsLoading(false);
      stopSpinner();
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="self-start sm:self-center border-0 sm:border-1 shadow-none sm:shadow-md p-2 flex-col sm:p-5 py-10 w-full sm:max-w-6/7 lg:flex-row 2xl:max-w-6/10">
        <div className="relative w-full ml-5 hidden lg:inline-block ">
          <img
            className="rounded-lg h-full w-full"
            src="/auth-banner.webp"
            alt="Person writing into a travel Journal with a map"
          />
          <div className="absolute inset-0 bg-overlay/20 rounded-lg"></div>
        </div>
        <div className="w-full self-center">
          <CardHeader className="gap-2">
            <Link to="/">
              <Logo className="w-55 m-auto mb-8" />
            </Link>
            <CardTitle>Zaloguj się</CardTitle>
            <CardDescription>
              Wprowadź swoje dane, aby uzyskać dostęp do konta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-10"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hasło</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mb-4"
                  disabled={isLoading}
                >
                  {showSpinner && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Zaloguj się
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Nie masz konta?{" "}
              <Link to="/auth/register" className="text-primary font-extrabold">
                Zarejestruj się
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/auth/login")({
  component: LoginComponent,
});
