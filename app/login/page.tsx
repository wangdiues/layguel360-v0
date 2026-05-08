import LoginForm from "./LoginForm";

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed: "The confirmation link is invalid or has expired. Please register again.",
  missing_confirmation_params: "The confirmation link is malformed. Please register again.",
  server_config: "Server configuration error. Contact support.",
};

export default async function LoginPage({ searchParams }: Props) {
  const { next = "", error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "An error occurred. Please try again.") : undefined;
  return <LoginForm next={next} urlError={errorMessage} />;
}
