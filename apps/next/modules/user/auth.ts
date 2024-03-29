import { revalidateCache } from "@/modules/utils/cache";
import { useMutation } from "@tanstack/react-query";
import { useSupabaseClient } from "@/modules/utils/client";
import type {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponse,
  SignInWithPasswordCredentials,
  SignInWithPasswordlessCredentials,
  SignUpWithPasswordCredentials,
  UserAttributes,
  UserResponse,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import type { MutationOptions, UseMutationResult } from "@tanstack/react-query";

type AuthHook<TData, TError, TVariables> = (
  options?: MutationOptions<TData, TError, TVariables>
) => UseMutationResult<TData, TError, TVariables>;

export const useSignUpWithEmailPassword: AuthHook<
  AuthResponse["data"],
  AuthResponse["error"],
  Extract<SignUpWithPasswordCredentials, { email: string }>
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const { data, error } = await supabase.auth.signUp(credentials);
      if (error) {
        throw error;
      }
      if (data.user?.identities?.length === 0) {
        throw new Error("User already registered");
      }
      revalidateCache();
      return data;
    },
    ...options,
  });
};

export const useSignInWithEmailPassword: AuthHook<
  AuthTokenResponse["data"],
  AuthTokenResponse["error"],
  Extract<SignInWithPasswordCredentials, { email: string }>
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword(
        credentials
      );
      if (error) {
        throw error;
      }
      revalidateCache();
      return data;
    },
    ...options,
  });
};

export const useSignUpWithEmailOtp: AuthHook<
  unknown,
  AuthOtpResponse["error"],
  Extract<SignInWithPasswordlessCredentials, { email: string }>
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const { error } = await supabase.auth.signInWithOtp({
        email: credentials.email,
        options: {
          shouldCreateUser: true,
          ...credentials.options,
        },
      });
      if (error) {
        throw error;
      }
    },
    ...options,
  });
};

export const useSignInWithEmailOtp: AuthHook<
  unknown,
  AuthOtpResponse["error"],
  Extract<SignInWithPasswordlessCredentials, { email: string }>
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const { error } = await supabase.auth.signInWithOtp({
        email: credentials.email,
        options: {
          shouldCreateUser: false,
          ...credentials.options,
        },
      });
      if (error) {
        throw error;
      }
    },
    ...options,
  });
};

export const useVerifyOtp: AuthHook<
  unknown,
  AuthOtpResponse["error"],
  Omit<Extract<VerifyOtpParams, { email: string }>, "type">
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const { error } = await supabase.auth.verifyOtp({
        email: credentials.email,
        token: credentials.token,
        type: "email",
      });
      if (error) {
        throw error;
      }
      revalidateCache();
    },
    ...options,
  });
};

export const useResetPasswordForEmail: AuthHook<
  unknown,
  AuthTokenResponse["error"],
  string
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
    },
    ...options,
  });
};

export const useSignOut: AuthHook<unknown, AuthTokenResponse["error"], void> = (
  options
) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      revalidateCache();
    },
    ...options,
  });
};

export const useUpdateUser: AuthHook<
  UserResponse["data"],
  AuthError | null,
  UserAttributes
> = (options) => {
  const supabase = useSupabaseClient();
  return useMutation({
    mutationFn: async (attributes) => {
      const { data, error } = await supabase.auth.updateUser(attributes);

      if (error) {
        throw error;
      }

      revalidateCache();
      return data;
    },
    ...options,
  });
};
