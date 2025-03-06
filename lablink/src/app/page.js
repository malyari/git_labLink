import Link from "next/link";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🚀 Hello, Scientists! 🧪</h1>
      <p>Welcome to the app that makes your life easier!</p>

      {/* Centered Buttons (Experiments, AI Chat, Collaboration) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px" }}>
        <Link href="/experiments">
          <button style={{ margin: "10px", padding: "15px 30px", fontSize: "18px" }}>
            Experiments
          </button>
        </Link>

        <Link href="/virtual-assistant">
          <button style={{ margin: "10px", padding: "15px 30px", fontSize: "18px" }}>
            Virtual Assistant
          </button>
        </Link>

        <Link href="/collaboration">
          <button style={{ margin: "10px", padding: "15px 30px", fontSize: "18px" }}>
            Collaboration
          </button>
        </Link>
      </div>

      {/* Bottom-left (Calendar) */}
      <div style={{ position: "absolute", bottom: "80px", left: "80px" }}>
        <Link href="/calendar">
          <button style={{ padding: "12px 25px", fontSize: "16px" }}>Calendar</button>
        </Link>
      </div>

      {/* Bottom-right (Settings) */}
      <div style={{ position: "absolute", bottom: "80px", right: "80px" }}>
        <Link href="/settings">
          <button style={{ padding: "12px 25px", fontSize: "16px" }}>Settings</button>
        </Link>
      </div>
    </main>
  );
}


