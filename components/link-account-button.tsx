"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { usePlaidLink } from "react-plaid-link"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface LinkAccountbutton extends ButtonProps {}

export function LinkAccountbutton({
  className,
  variant,
  ...props
}: LinkAccountbutton) {
  const router = useRouter()
  const [linkToken, setLinkToken] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const onLinkSuccess = React.useCallback(async (publicToken, metadata) => {
    console.log(publicToken)
    // await fetch("/api/exchange-public-token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ public_token: publicToken }),
    // })
    // Router.push("/dash")
  }, [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onLinkSuccess,
  })

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/link", {
      method: "POST",
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          title: "Limit of 3 posts reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Your post was not created. Please try again.",
        variant: "destructive",
      })
    }

    const { link_token: linkToken } = await response.json()
    setLinkToken(linkToken)
  }

  React.useEffect(() => {
    if (linkToken && ready) {
      open()
    }
  }, [linkToken, ready, open])

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      Link account
    </button>
  )
}
