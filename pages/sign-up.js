import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Account created. You can now log in.");
    setLoading(false);
    setEmail("");
    setPassword("");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07111f", color: "white", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "28px" }}>
        <h1 style={{ marginTop: 0 }}>Create your account</h1>
        <p style={{ color: "#bfd0ea" }}>Start using TradeMate AI.</p>

        <form onSubmit={handleSignUp} style={{ display: "grid", gap: "14px", marginTop: "20px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ height: "52px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", padding: "0 14px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ height: "52px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", padding: "0 14px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ height: "52px", borderRadius: "12px", border: "none", background: "white", color: "#081221", fontWeight: 700, cursor: "pointer" }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {message ? (
          <p style={{ marginTop: "16px", color: "#d7e5ff" }}>{message}</p>
        ) : null}

        <p style={{ marginTop: "18px", color: "#bfd0ea" }}>
          Already have an account? <a href="/login" style={{ color: "white" }}>Log in</a>
        </p>
      </div>
    </div>
  );
}
