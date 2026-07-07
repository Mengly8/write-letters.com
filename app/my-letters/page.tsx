import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const themeStyles: Record<
  string,
  { fontFamily: string; backgroundColor: string; color: string; accent: string }
> = {
  vintage: {
    fontFamily: "'Yellowtail', cursive",
    backgroundColor: "#fdfbf7",
    color: "#2c2520",
    accent: "#8c7662",
  },
  royal: {
    fontFamily: "'Monsieur La Doulaise', cursive",
    backgroundColor: "#f4f0fa",
    color: "#2c2520",
    accent: "#6b4fa0",
  },
  "love-letter": {
    fontFamily: "'Playfair Display', serif",
    backgroundColor: "#fff0f2",
    color: "#2c2520",
    accent: "#c9788a",
  },
  notebook: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f0f7ff",
    color: "#2c2520",
    accent: "#4a7fb5",
  },
};

export default async function MyLetters() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: letters, error } = await supabase
    .from("letters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Cinzel', serif", letterSpacing: "2px" }}>
        My Letters
      </h1>
      <p style={{ color: "#705e52", marginBottom: "30px" }}>
        Every letter you've sent, in one place.
      </p>

      {error && (
        <p style={{ color: "red" }}>Something went wrong: {error.message}</p>
      )}

      {!error && letters?.length === 0 && (
        <p style={{ color: "#705e52" }}>
          You haven't sent any letters yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {letters?.map((letter) => {
          const style = themeStyles[letter.theme] || themeStyles.vintage;
          return (
            <div
              key={letter.id}
              style={{
                backgroundColor: style.backgroundColor,
                border: `1px solid ${style.accent}33`,
                borderRadius: "6px",
                padding: "25px 30px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "10px",
                }}
              >
                <h2
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: "1.5rem",
                    color: style.color,
                    margin: 0,
                  }}
                >
                  {letter.title || "Untitled Letter"}
                </h2>
                <span style={{ fontSize: "0.8rem", color: style.accent }}>
                  {new Date(letter.created_at).toLocaleDateString()}
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: style.accent,
                  marginBottom: "12px",
                }}
              >
                To: {letter.recipient_email}
              </p>

              <p
                style={{
                  fontFamily: style.fontFamily,
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  color: style.color,
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {letter.content?.length > 200
                  ? `${letter.content.slice(0, 200)}...`
                  : letter.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}