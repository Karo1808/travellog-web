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
import { Loader2 } from "lucide-react";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/lib/validations/register";
import { postRegister } from "@/api/services/postRegister";
import { toast } from "sonner";
import useDelayedSpinner from "@/hooks/useDelayedSpinner";

function RegisterComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSpinner, startSpinner, stopSpinner } = useDelayedSpinner(500);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    startSpinner();

    try {
      await postRegister(values);
      toast.success("Konto zostało pomyślnie utworzone");
      navigate({ to: "/auth/login" });
    } catch (error) {
      if ((error as Error).message.includes("400"))
        toast.error("To konto już istnieje, spróbuj podać inne dane");
      else toast.error("Coś poszło nie tak, spróbuj ponownie");
    } finally {
      setIsLoading(false);
      stopSpinner();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="flex-col self-start w-full p-2 py-10 border-0 shadow-none sm:self-center sm:border-1 sm:shadow-md sm:p-5 sm:max-w-6/7 lg:flex-row 2xl:max-w-7/10">
        <div className="relative hidden w-full ml-5 lg:inline-block ">
          <img
            className="w-full h-full rounded-lg"
            src="/auth-banner.webp"
            alt="Person writing into a travel Journal with a map"
          />
          <div className="absolute inset-0 rounded-lg bg-overlay/20"></div>
        </div>
        <div className="self-center w-full">
          <CardHeader className="gap-2">
            <Link to="/">
              <Logo className="w-55 m-auto mb-8" />
            </Link>
            <CardTitle>Zarejestruj się</CardTitle>
            <CardDescription>Utwórz nowe konto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa użytkownika</FormLabel>
                      <FormControl>
                        <Input placeholder="uzytkownik123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potwierdź hasło</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
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
                  Zarejestruj się
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-sm text-center">
              Masz już konto?{" "}
              <Link to="/auth/login" className="font-extrabold text-primary">
                Zaloguj się
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/auth/register")({
  component: RegisterComponent,
});
