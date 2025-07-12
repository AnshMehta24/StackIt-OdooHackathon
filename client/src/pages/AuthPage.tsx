import RHFPasswordInput from "@/components/RHF/RHFPasswordInput";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignIn, useSignUp } from "@/hooks/services/auth";
import { useUser } from "@/hooks/services/user";
import { authSchema, type AuthFormData } from "@/schema/auth.";
import { socket } from "@/socket/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const methods = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      auth: "signIn",
      email: "",
      password: "",
      name: "",
    },
  });

  const { setValue, handleSubmit, watch } = methods;

  const { data: User, isLoading } = useUser();
  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();

  useEffect(() => {
    if (User && User.success) {
      toast("Already logged in, redirecting to home page");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [User]);

  if (isLoading) return <div>Loading...</div>;

  const authValue = watch("auth");

  const onSubmit = async (data: AuthFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      switch (authValue) {
        case "signUp": {
          toast.loading("Creating account...");
          const response = await signUpMutation.mutateAsync(formData);
          socket.emit("join", response.data.userId);
          toast.success("Account created successfully!");
          navigate("/");
          break;
        }

        case "signIn": {
          toast.loading("Logging in...");
          const response = await signInMutation.mutateAsync(formData);
          socket.emit("join", response.data.userId);
          toast.success("Logged in successfully!");
          console.log("✅ SignIn Response:", response);
          navigate("/");
          break;
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error("❌ Auth error:", err.message);
      } else {
        toast.error("Something went wrong");
        console.error("❌ Unknown error:", err);
      }
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <AuthForm /> */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {authValue === "signUp"
                  ? "Create an account"
                  : "Login to your account"}
              </CardTitle>
              <CardDescription>
                {authValue === "signUp"
                  ? "Enter your details below to create your account"
                  : "Enter your email below to login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="flex flex-col gap-6">
                    {authValue === "signUp" && (
                      <>
                        <div className="grid gap-3">
                          <RHFTextInput
                            label="Name"
                            name="name"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="grid gap-3">
                          <RHFTextInput
                            label="Username"
                            name="username"
                            placeholder="Your unique username"
                          />
                        </div>
                      </>
                    )}

                    <div className="grid gap-3">
                      <RHFTextInput
                        label="Email"
                        name="email"
                        placeholder="m@example.com"
                      />
                    </div>

                    <div className="grid gap-3">
                      <RHFPasswordInput
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                      />

                      {authValue !== "signUp" && (
                        <div className="flex items-center">
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full text-foreground">
                        {authValue === "signUp" ? "Sign up" : "Login"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm">
                    {authValue === "signUp" ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="underline underline-offset-4"
                          onClick={() => setValue("auth", "signIn")}
                        >
                          Login
                        </button>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          className="underline underline-offset-4 cursor-pointer"
                          onClick={() => setValue("auth", "signUp")}
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
