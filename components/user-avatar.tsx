import { AvatarProps } from "@radix-ui/react-avatar"

import { User } from "@/lib/session"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "photoURL" | "displayName">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.photoURL ? (
        <AvatarImage alt="Picture" src={user.photoURL} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.displayName}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
