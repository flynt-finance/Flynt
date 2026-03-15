/**
 * API types. Add endpoint-specific request/response types here as you add endpoints.
 */

/** Global API response shape (e.g. auth endpoints). */
export interface TypeApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface ApiResponse<T = unknown> {
  status: boolean
  message?: string
  data?: T
}

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  authProvider: string
  authProviderId: string | null
  role: string
  onboardingCompleted: boolean
  emailVerified: boolean
  twoFactorEnabled?: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginResponseDataStandard {
  user: User
  token: string
}

export interface LoginResponseData2FaRequired {
  requiresTwoFactor: true
  preAuthToken: string
  user: Pick<User, "id" | "email" | "name">
  message?: string
}

export type LoginResponseData =
  | LoginResponseDataStandard
  | LoginResponseData2FaRequired

export interface TwoFaVerifyLoginPayload {
  preAuthToken: string
  code: string
}

export interface TwoFaVerifyLoginResponseData {
  user: User
  token: string
}

export interface SocialAuthPayload {
  provider: "google" | "apple"
  token: string
}

export interface SocialAuthResponseData {
  user: User
  token: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  phone?: string
  countryCode?: string
}

export interface RegisterResponseData {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface VerifyOtpResponseData {
  verified: boolean
  email: string
  userId: string
}

export interface SendOtpPayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponseData {
  sent: boolean
  email: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  newPassword: string
}

export interface ResetPasswordResponseData {
  success: boolean
  message: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponseData {
  success: boolean
  message: string
}

export interface TwoFaSetupResponseData {
  qrCode: string
  secret: string
  backupCodes: string[]
  message: string
}

export interface TwoFaConfirmPayload {
  secret: string
  token: string
  backupCodes: string
}

export interface TwoFaConfirmResponseData {
  message: string
  backupCodes: string
  notice: string
}

export interface TwoFaStatusResponseData {
  enabled: boolean
}

export interface TwoFaDisablePayload {
  password: string
}

export interface TwoFaDisableResponseData {
  [key: string]: unknown
}

export interface CustomFetchConfig {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  params?: Record<string, unknown>
  responseType?: "json" | "text" | "blob" | "arraybuffer" | "stream"
  [key: string]: unknown
}

export interface CustomFetchQueryOptions {
  queryKey?: string[] | (() => string[])
  enabled?: boolean | (() => boolean)
  staleTime?: number
  gcTime?: number
  refetchOnWindowFocus?: boolean
  config?: CustomFetchConfig
}

export interface CustomFetchMutationOptions<T = unknown> {
  onSuccess?: (data: ApiResponse<T>) => void
  onError?: (error: unknown) => void
  invalidateQueries?: string[][]
  config?: CustomFetchConfig
}

/** POST /onboarding/complete payload */
export interface OnboardingCompletePayload {
  employmentStatus: "salaried" | "self-employed" | "freelancer" | "business-owner"
  incomeRange: "100k-250k" | "250k-500k" | "500k-1m" | "1m+"
  financialGoal: "control-spending" | "save-money" | "start-investing" | "plan-future"
  budgetingExperience: "new" | "some-experience" | "experienced"
  mono: string
  monoCode: string
  authorizationConsent: boolean
}

export interface OnboardingProfile {
  id: string
  userId: string
  employmentStatus: string
  incomeRange: string
  financialGoal: string
  budgetingExperience: string
  authorizationConsent: boolean
  isCompleted: boolean
  completedAt: string
  createdAt: string
  updatedAt: string
}

export interface LinkedAccount {
  id: string
  userId: string
  bankName: string
  accountNumber: string
  monoAccountId: string
  balance: number
  currency: string
  institution: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** GET /banking/linked-accounts response */
export type LinkedAccountsApiResponse = TypeApiResponse<LinkedAccount[]>

export interface OnboardingCompleteResponseData {
  profile: OnboardingProfile
  linkedAccounts: LinkedAccount[]
}

/** POST /onboarding/complete response */
export interface OnboardingCompleteResponse {
  success: boolean
  data: OnboardingCompleteResponseData
  message: string
}
