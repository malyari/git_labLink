import Link from "next/link";
import { Home } from "lucide-react"; 

export default function NotesCollaborationPage() {
  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>📝 Notes & Collaboration</h1>
      <p>Share notes, collaborate with team members, and discuss experiment findings.</p>

      {/* Back to Experiment 1 Page Button (Bottom-left) */}
      <div style={{ position: "absolute", bottom: "20px", left: "80px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            Back to Experiment 1
          </button>
        </Link>
      </div>

      {/* Home Icon Button (Bottom-right) */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "24px",
            padding: "10px"
          }}>
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
