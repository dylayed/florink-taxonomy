"use client"

import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth"
import { useRouter } from "next/navigation"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { useFirebaseAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

const actionCodeSettings = {
  url: "https://super-funicular-975q5j6rv462p6j4-3000.app.github.dev/login",
  handleCodeInApp: true,
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })

  const { getFirebaseAuth } = useFirebaseAuth()
  const auth = getFirebaseAuth()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    let signInResult
    try {
      const email = data.email.toLowerCase()
      signInResult = await sendSignInLinkToEmail(
        auth,
        email,
        actionCodeSettings
      )
      window.localStorage.setItem("emailForSignIn", email)
      return toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      })
    } catch (e: any) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    async function handleSignInLink() {
      try {
        const email = window.localStorage.getItem("emailForSignIn")
        if (email) {
          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          )
          const idTokenResult = await result.user.getIdTokenResult();
          console.log(result)
          console.log(idTokenResult)
        }
      } catch (err: any) {
        toast({
          title: "Something went wrong.",
          description: "Your sign in request failed. Please try again.",
          variant: "destructive",
        })
        router.push("/login")
      }
    }
    if (typeof window !== "undefined") {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        handleSignInLink()
      }
    }
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
    </div>
  )
}
