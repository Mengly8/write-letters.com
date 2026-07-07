import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.json();

  // Create a server-side Supabase client that knows who's logged in
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

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to send a letter." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("letters")
    .insert([
      {
        title: body.title,
        content: body.content,
        recipient_email: body.recipient_email,
        theme: body.theme,
        user_id: user.id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const themeStyles: Record <
    string,
    { fontFamily: string; backgroundColor: string; color: string }
  > = {
    vintage: {
      fontFamily: "'Yellowtail', cursive",
      backgroundColor: "#fdfbf7",
      color: "#2c2520",
    },
    royal: {
      fontFamily: "'Monsieur La Doulaise', cursive",
      backgroundColor: "#f4f0fa",
      color: "#2c2520",
    },
    "love-letter": {
      fontFamily: "'Playfair Display', serif",
      backgroundColor: "#fff0f2",
      color: "#2c2520",
    },
    notebook: {
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f0f7ff",
      color: "#2c2520",
    },
  };

  const style = themeStyles[body.theme] || themeStyles.vintage;

  const html = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Yellowtail&family=Monsieur+La+Doulaise&family=Playfair+Display:ital@0;1&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body style="background-color: #fcf8f2; margin: 0; padding: 40px 0;">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background-color: ${style.backgroundColor};
          padding: 50px;
          border: 1px solid #e6ded4;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        ">
          <h1 style="
            font-family: 'Cinzel', serif;
            font-size: 2rem;
            text-align: center;
            letter-spacing: 4px;
            color: #4a3b32;
            margin-bottom: 5px;
          ">Letters</h1>
          <p style="
            font-family: 'Playfair Display', serif;
            font-style: italic;
            text-align: center;
            color: #705e52;
            margin-top: 0;
            margin-bottom: 30px;
          ">You have received a letter</p>
          <hr style="border: none; border-top: 1px solid #dcd1c4; margin: 30px auto; width: 60%;" />
          <div style="
            font-family: ${style.fontFamily};
            font-size: 1.15rem;
            line-height: 1.8;
            color: ${style.color};
            white-space: pre-wrap;
          ">${body.content}</div>
          <hr style="border: none; border-top: 1px solid #dcd1c4; margin: 30px auto; width: 60%;" />
          <p style="
            font-family: 'Playfair Display', serif;
            font-style: italic;
            text-align: center;
            color: #705e52;
            font-size: 0.85rem;
          ">Sent with Letters — bring back the art of letter writing.</p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "Letters <hello@write-letters.com>",
      to: body.recipient_email,
      replyTo: body.originator_email,
      subject: "You've received a letter ✉️",
      html: html,
    });
  } catch (emailError) {
    console.error("Email send failed:", emailError);
    // Letter is still saved even if email fails — don't throw
  }

  return NextResponse.json(data);
}