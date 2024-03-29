"use client";

import * as React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CircleIcon,
  CrossCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetProfile, useUpdateProfile } from "@/modules/user/profile";

export const ProfileForm: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, isLoading, isError, error } = useGetProfile({ id: userId });

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="animate-pulse">
          <CircleIcon className="size-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Alert variant="destructive">
          <CrossCircledIcon className="size-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
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
    <ProfileFormContainer
      id={data.id}
      username={data.username}
      fullName={data.full_name}
      preferredName={data.preferred_name}
    />
  );
};

export const ProfileFormContainer: React.FC<{
  id: string;
  username: string;
  fullName: string | null;
  preferredName: string | null;
}> = ({ id, username, fullName, preferredName }) => {
  const router = useRouter();
  // #region useUpdateProfile
  const {
    mutate: updateProfile,
    isPending,
    isError,
    error,
  } = useUpdateProfile({
    onSuccess: () => {
      router.push("/settings");
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error(error.message);
      }
    },
  });
  // #endregion useUpdateProfile

  return (
    <ProfileFormComponent
      key={JSON.stringify({ username, fullName, preferredName })}
      id={id}
      username={username}
      fullName={fullName}
      preferredName={preferredName}
      updateProfile={updateProfile}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    />
  );
};

const FormSchema = z.object({
  username: z.string().min(3, { message: "Must be 3 or more characters long" }),
  full_name: z
    .string()
    .min(3, { message: "Must be 3 or more characters long" }),
  preferred_name: z
    .string()
    .min(3, { message: "Must be 3 or more characters long" }),
});

const ProfileFormComponent: React.FC<{
  id: string;
  username: string;
  fullName: string | null;
  preferredName: string | null;
  updateProfile: ({
    id,
    username,
    full_name,
    preferred_name,
  }: {
    id: string;
    username: string;
    full_name: string;
    preferred_name?: string;
  }) => void;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
}> = ({
  id,
  username,
  fullName,
  preferredName,
  updateProfile,
  isPending,
  isError,
  errorMessage,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username,
      full_name: fullName ?? "",
      preferred_name: preferredName ?? "",
    },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Profile Settings
        </h2>
        <p>Manage your profile settings</p>
      </header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            ({ username, full_name, preferred_name }) => {
              updateProfile({ id, username, full_name, preferred_name });
            }
          )}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="sosa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Hector Sosa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferred_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred name</FormLabel>
                <FormControl>
                  <Input placeholder="Hector" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && (
            <Alert variant="destructive">
              <CrossCircledIcon className="size-4" />
              <AlertTitle>Something went wrong!</AlertTitle>
              <AlertDescription>
                {errorMessage ?? "Unknown error"}
              </AlertDescription>
            </Alert>
          )}
          <footer className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={isPending}>
              {isPending && <CircleIcon className="mr-2 size-4 animate-spin" />}
              Update Settings
            </Button>
            <Button asChild variant="link">
              <Link href="/settings/account">Account Settings</Link>
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
