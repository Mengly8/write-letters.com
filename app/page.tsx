'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [originatorEmail, setOriginatorEmail] = useState('');
  const [theme, setTheme] = useState('vintage');
  const [letterTitle, setLetterTitle] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/sign-in';
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const themes: Record<string, { fontFamily: string; backgroundColor: string }> = {
    vintage: {
      fontFamily: "'Yellowtail', cursive",
      backgroundColor: "#fdfbf7"
    },
    royal: {
      fontFamily: "'Monsieur La Doulaise', cursive",
      backgroundColor: "#f4f0fa"
    },
    "love-letter": {
      fontFamily: "'Playfair Display', serif",
      backgroundColor: "#fff0f2"
    },
    notebook: {
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f0f7ff"
    }
  };

  // Falls back to the first few words of the letter body if no title was given
  const resolveTitle = () => {
    const trimmedTitle = letterTitle.trim();
    if (trimmedTitle) return trimmedTitle;

    const trimmedBody = letterBody.trim();
    if (!trimmedBody) return 'Untitled Letter';

    const words = trimmedBody.split(/\s+/).slice(0, 6).join(' ');
    return words.length < trimmedBody.length ? `${words}…` : words;
  };

  const saveLetter = async () => {
    try {
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: resolveTitle(),
          content: letterBody,
          recipient_email: recipientEmail,
          originator_email: originatorEmail,
          theme: theme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Letter sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save letter.");
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }} className="your-original-container-class">
     <h1>Letters</h1>
<p>Bring back the art of letter writing.</p>
<a
  href="/my-letters"
  style={{
    display: 'inline-block',
    marginBottom: '10px',
    color: '#8c7662',
    textDecoration: 'underline',
    cursor: 'pointer',
  }}
>
  View My Letters →
</a>
<hr />

      <h2>Create</h2>

      <label style={{ display: 'block', marginTop: '10px' }}>Title (optional)</label>
      <input
        type="text"
        id="letterTitle"
        placeholder="e.g. A note for you"
        value={letterTitle}
        onChange={(e) => setLetterTitle(e.target.value)}
        style={{ width: '100%' }}
      />

      <label style={{ display: 'block', marginTop: '10px' }}>Recipient Email</label>
      <input
        type="email"
        id="recipientEmail"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
      />

      <label style={{ display: 'block', marginTop: '10px' }}>Originator Email</label>
      <input
        type="email"
        id="originatorEmail"
        value={originatorEmail}
        onChange={(e) => setOriginatorEmail(e.target.value)}
      />

      <br /><br />

      <label style={{ display: 'block' }}>Please select a theme</label>
      <select
        id="themeSelect"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="vintage">Vintage</option>
        <option value="royal">Royal</option>
        <option value="love-letter">Love Letter</option>
        <option value="notebook">Notebook</option>
      </select>

      <br /><br />

      <textarea
        id="letterBody"
        rows={12}
        cols={60}
        value={letterBody}
        onChange={(e) => setLetterBody(e.target.value)}
        style={{
          fontFamily: themes[theme].fontFamily,
          backgroundColor: themes[theme].backgroundColor,
          width: '100%',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          transition: 'all 0.3s ease'
        }}
      ></textarea>

      <br /><br />

      <button onClick={saveLetter}>
        Send Letter
      </button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = '/sign-in';
        }}
        style={{ backgroundColor: '#888', marginTop: '10px' }}
      >
        Sign Out
      </button>
    </div>
  );
}