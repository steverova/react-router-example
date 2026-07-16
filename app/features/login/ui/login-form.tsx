import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FetcherWithComponents } from "react-router"
import type { LoginInput } from "../login.schema"
import { loginSchema } from "../login.schema"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

interface LoginFormProps {
  fetcher: FetcherWithComponents<unknown>
}

function EmailField() {
  const { register, formState: { errors } } = useFormContext<LoginInput>()
  
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="m@example.com"
        {...register("email")}
      />
      {errors.email && (
        <p className="text-red-500 text-xs">{errors.email.message}</p>
      )}
    </div>
  )
}

function PasswordField() {
  const { register, formState: { errors } } = useFormContext<LoginInput>()
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        <a
          href="#"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </div>
      <Input
        id="password"
        type="password"
        {...register("password")}
      />
      {errors.password && (
        <p className="text-red-500 text-xs">{errors.password.message}</p>
      )}
    </div>
  )
}

export function LoginForm({ fetcher }: LoginFormProps) {
  
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "password123",
    },
  })

  const isLoggingIn = fetcher.state !== "idle"

  const onSubmit = (data: LoginInput) => {
    fetcher.submit(data, { method: "post" })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <EmailField />
        <PasswordField />
        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </form>
    </FormProvider>
  )
}
