"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { set } from "date-fns"
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { actionCodeSettings, useFirebaseAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const params = useSearchParams()
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

    try {
      const email = data.email.toLowerCase()

      let url = actionCodeSettings.url
      const redirectParam = params.get("redirect")
      if (redirectParam) {
        url = url + `?redirect=${redirectParam}`
      }
      await sendSignInLinkToEmail(auth, email, {
        ...actionCodeSettings,
        url,
      })
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
    async function handleSignInLink(email) {
      try {
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        )
        console.log(result.user)
        const token = await result.user.getIdToken()
        console.log("!!!")
        console.log(token)
        await fetch("/api/login", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        router.push(params.get("redirect") || "/dashboard")
      } catch (err: any) {
        toast({
          title: "Something went wrong.",
          description: "Your sign in request failed. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }
    if (typeof window !== "undefined") {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignIn")
        window.localStorage.removeItem("emailForSignIn")
        if (email) {
          setIsLoading(true)
          handleSignInLink(email)
        } else {
          toast({
            title: "Something went wrong.",
            description: "Your sign in request failed. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
  }, [])

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
