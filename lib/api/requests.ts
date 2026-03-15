/**
 * Define new API requests here; add request/response types in lib/api/types.ts.
 */

import {
  customFetch,
  useCustomFetchQuery,
  useCustomFetchMutation,
  createQueryKey,
} from "./client";
import type {
  ApiResponse,
  TypeApiResponse,
  User,
  LoginResponseData,
  RegisterPayload,
  RegisterResponseData,
  VerifyOtpPayload,
  VerifyOtpResponseData,
  SendOtpPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponseData,
  ResetPasswordPayload,
  ResetPasswordResponseData,
  ChangePasswordPayload,
  ChangePasswordResponseData,
  TwoFaSetupResponseData,
  TwoFaConfirmPayload,
  TwoFaConfirmResponseData,
  TwoFaStatusResponseData,
  TwoFaDisablePayload,
  TwoFaDisableResponseData,
  TwoFaVerifyLoginPayload,
  TwoFaVerifyLoginResponseData,
  SocialAuthPayload,
  SocialAuthResponseData,
  OnboardingCompletePayload,
  OnboardingCompleteResponse,
  LinkedAccountsApiResponse,
  LinkBankPayload,
  LinkBankApiResponse,
  UnlinkBankApiResponse,
} from "./types";

/** 2FA status query key for invalidations */
export const TWO_FA_STATUS_QUERY_KEY = "2fa-status";

/** Linked accounts query key for invalidations */
export const LINKED_ACCOUNTS_QUERY_KEY = "banking/linked-accounts";

/** GET /banking/linked-accounts */
export function useLinkedAccountsQuery() {
  return useCustomFetchQuery<LinkedAccountsApiResponse>(
    "/banking/linked-accounts",
    { queryKey: [LINKED_ACCOUNTS_QUERY_KEY] }
  );
}

/** POST /banking/link */
export async function linkBankRequest(
  body: LinkBankPayload
): Promise<LinkBankApiResponse> {
  return customFetch<LinkBankApiResponse>("/banking/link", {
    method: "post",
    body,
  });
}

/** DELETE /banking/linked-accounts/:id */
export async function unlinkBankAccountRequest(
  id: string
): Promise<UnlinkBankApiResponse> {
  return customFetch<UnlinkBankApiResponse>(
    `/banking/linked-accounts/${id}`,
    { method: "delete" }
  );
}

/** Example: GET /example - add response type in types.ts when you have a real endpoint */
export const EXAMPLE_QUERY_KEY = "example";

export function useExampleQuery() {
  return useCustomFetchQuery<{ id: string; name: string }>("/example", {
    queryKey: [EXAMPLE_QUERY_KEY],
  });
}

/** Example: POST /example - add request/response types in types.ts when you have a real endpoint */
export function useCreateExampleMutation() {
  return useCustomFetchMutation<{ id: string }>("/example", "POST", {
    invalidateQueries: [[EXAMPLE_QUERY_KEY]],
  });
}

/** Example: raw fetch (e.g. for server or one-off calls) */
export async function getExample(): Promise<ApiResponse<{ id: string; name: string }>> {
  return customFetch<ApiResponse<{ id: string; name: string }>>("/example", {
    method: "get",
  });
}

/** POST /auth/login */
export async function loginRequest(body: {
  email: string
  password: string
}): Promise<TypeApiResponse<LoginResponseData>> {
  return customFetch<TypeApiResponse<LoginResponseData>>("/auth/login", {
    method: "post",
    body,
  });
}

/** GET /auth/me */
export async function getCurrentUser(): Promise<TypeApiResponse<{ user: User }>> {
  return customFetch<TypeApiResponse<{ user: User }>>("/auth/me", {
    method: "get",
  });
}

/** POST /auth/register */
export async function registerRequest(body: RegisterPayload): Promise<TypeApiResponse<RegisterResponseData>> {
  return customFetch<TypeApiResponse<RegisterResponseData>>("/auth/register", {
    method: "post",
    body,
  });
}

/** POST /auth/verify-otp */
export async function verifyOtpRequest(body: VerifyOtpPayload): Promise<TypeApiResponse<VerifyOtpResponseData>> {
  return customFetch<TypeApiResponse<VerifyOtpResponseData>>("/auth/verify-otp", {
    method: "post",
    body,
  });
}

/** POST /auth/send-otp */
export async function sendOtpRequest(body: SendOtpPayload): Promise<TypeApiResponse<unknown>> {
  return customFetch<TypeApiResponse<unknown>>("/auth/send-otp", {
    method: "post",
    body,
  });
}

/** POST /auth/forgot-password */
export async function forgotPasswordRequest(
  body: ForgotPasswordPayload
): Promise<TypeApiResponse<ForgotPasswordResponseData>> {
  return customFetch<TypeApiResponse<ForgotPasswordResponseData>>("/auth/forgot-password", {
    method: "post",
    body,
  });
}

/** POST /auth/reset-password */
export async function resetPasswordRequest(
  body: ResetPasswordPayload
): Promise<TypeApiResponse<ResetPasswordResponseData>> {
  return customFetch<TypeApiResponse<ResetPasswordResponseData>>("/auth/reset-password", {
    method: "post",
    body,
  });
}

/** POST /auth/change-password */
export async function changePasswordRequest(
  body: ChangePasswordPayload
): Promise<TypeApiResponse<ChangePasswordResponseData>> {
  return customFetch<TypeApiResponse<ChangePasswordResponseData>>("/auth/change-password", {
    method: "post",
    body,
  });
}

/** GET /auth/2fa/status */
export function useTwoFaStatusQuery() {
  return useCustomFetchQuery<TwoFaStatusResponseData>("/auth/2fa/status", {
    queryKey: [TWO_FA_STATUS_QUERY_KEY],
  });
}

/** POST /auth/2fa/setup */
export async function twoFaSetupRequest(): Promise<TypeApiResponse<TwoFaSetupResponseData>> {
  return customFetch<TypeApiResponse<TwoFaSetupResponseData>>("/auth/2fa/setup", {
    method: "post",
  });
}

/** POST /auth/2fa/confirm */
export async function twoFaConfirmRequest(
  body: TwoFaConfirmPayload
): Promise<TypeApiResponse<TwoFaConfirmResponseData>> {
  return customFetch<TypeApiResponse<TwoFaConfirmResponseData>>("/auth/2fa/confirm", {
    method: "post",
    body,
  });
}

/** DELETE /auth/2fa/disable */
export function useTwoFaDisableMutation() {
  return useCustomFetchMutation<TwoFaDisableResponseData>("/auth/2fa/disable", "DELETE", {
    invalidateQueries: [[TWO_FA_STATUS_QUERY_KEY]],
  });
}

/** POST /auth/2fa/verify-login */
export async function twoFaVerifyLoginRequest(
  body: TwoFaVerifyLoginPayload
): Promise<TypeApiResponse<TwoFaVerifyLoginResponseData>> {
  return customFetch<TypeApiResponse<TwoFaVerifyLoginResponseData>>(
    "/auth/2fa/verify-login",
    { method: "post", body }
  );
}

/** POST /auth/social */
export async function socialAuthRequest(
  body: SocialAuthPayload
): Promise<TypeApiResponse<SocialAuthResponseData>> {
  return customFetch<TypeApiResponse<SocialAuthResponseData>>("/auth/social", {
    method: "post",
    body,
  });
}

/** POST /onboarding/complete */
export async function onboardingCompleteRequest(
  body: OnboardingCompletePayload
): Promise<OnboardingCompleteResponse> {
  return customFetch<OnboardingCompleteResponse>("/onboarding/complete", {
    method: "post",
    body,
  });
}

export { createQueryKey };
