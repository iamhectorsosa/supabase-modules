"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/modules/user/profile";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/modules/user/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  CircleIcon,
  CrossCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Accounts: React.FC<{ userId: string }> = ({ userId }) => {
  const profile = useQuery({
    queryKey: ["profiles", userId],
    queryFn: () => getProfile({ id: userId }),
  });

  if (profile.isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="animate-pulse">
          <CircleIcon className="size-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (profile.isError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Alert variant="destructive">
          <CrossCircledIcon className="size-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            {profile.error instanceof Error
              ? profile.error.message
              : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Alert>
          <InfoCircledIcon className="size-4" />
          <AlertTitle>No data found!</AlertTitle>
          <AlertDescription>
            Please contact the administrator for more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AccountsContainer
      username={profile.data.username}
      preferredName={profile.data.preferred_name}
      email={profile.data.email}
    />
  );
};

export const AccountsContainer: React.FC<{
  username: string;
  preferredName: string | null;
  email: string;
}> = ({ username, preferredName, email }) => {
  const logout = useMutation({
    mutationFn: signOut,
  });

  return (
    <AccountsComponent
      username={username}
      preferredName={preferredName}
      email={email}
      signOut={() =>
        logout.mutate({
          redirect: {
            url: "/login",
          },
        })
      }
      isPending={logout.isPending}
      isError={logout.isError}
      errorMessage={logout.error?.message}
    />
  );
};

const AccountsComponent: React.FC<{
  username: string;
  preferredName: string | null;
  email: string;
  signOut: () => void;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
}> = ({
  username,
  preferredName,
  email,
  signOut,
  isPending,
  isError,
  errorMessage,
}) => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
        <p>{preferredName ? `Hello, ${preferredName}!` : "Hi there!"}</p>
      </header>
      <div className="flex items-center gap-x-4">
        <Avatar>
          <AvatarImage src="https://ui.shadcn.com/avatars/04.png" />
          <AvatarFallback>
            {username.toUpperCase().substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{username}</h4>
          <p>{email}</p>
        </div>
        <div className="ml-auto flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button
            onClick={() => signOut()}
            disabled={isPending}
            variant="secondary"
            className="px-3 shadow-none"
          >
            {isPending && <CircleIcon className="mr-2 size-4 animate-spin" />}
            Sign out
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="size-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuItem>
                <Link href="/settings/profile">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/credentials">Credentials settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={true}>
                <TrashIcon className="mr-2 size-4" /> Remove account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isError && (
        <Alert variant="destructive">
          <CrossCircledIcon className="size-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{errorMessage ?? "Unknown error"}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
