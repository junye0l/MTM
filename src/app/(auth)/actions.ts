"use server";

import { redirect } from "next/navigation";
import type { UserRole } from "@/types/domain";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabaseClient";

export type AuthActionState = {
  status: "idle" | "error";
  message?: string;
};

const LOGIN_REDIRECT_PATH = "/";
const SIGNUP_REDIRECT_PATH = "/login?welcome=1";

const isUserRole = (value: string): value is UserRole =>
  ["mentor", "mentee", "admin"].includes(value);

const extractField = (formData: FormData, key: string) =>
  formData.get(key)?.toString().trim() ?? "";

const toFriendlyMessage = (raw: string) => {
  if (raw.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (raw.includes("User already registered")) {
    return "이미 가입된 이메일입니다.";
  }
  return raw || "잠시 후 다시 시도해 주세요.";
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = extractField(formData, "email");
  const password = extractField(formData, "password");

  if (!email || !password) {
    return { status: "error", message: "이메일과 비밀번호를 모두 입력해 주세요." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { status: "error", message: toFriendlyMessage(error.message) };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.";
    return { status: "error", message };
  }

  redirect(LOGIN_REDIRECT_PATH);
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = extractField(formData, "name");
  const email = extractField(formData, "email");
  const password = extractField(formData, "password");
  const organization = extractField(formData, "organization");
  const requestedRole = extractField(formData, "role");
  const role: UserRole = isUserRole(requestedRole) ? requestedRole : "mentee";

  if (!name || !email || !password) {
    return { status: "error", message: "필수 정보를 모두 입력해 주세요." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, organization },
      },
    });

    if (error) {
      return { status: "error", message: toFriendlyMessage(error.message) };
    }

    const userId = user?.id;
    if (userId) {
      const client =
        process.env.SUPABASE_SERVICE_ROLE_KEY !== undefined
          ? createSupabaseServiceClient()
          : supabase;

      const { error: profileError } = await client.from("profiles").upsert({
        id: userId,
        name,
        role,
        organization: organization || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        return {
          status: "error",
          message: "프로필 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        };
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "회원가입 처리 중 오류가 발생했습니다.";
    return { status: "error", message };
  }

  redirect(SIGNUP_REDIRECT_PATH);
}
