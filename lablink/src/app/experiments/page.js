import Link from "next/link";
import { Home } from "lucide-react"; 

export default function ExperimentsPage() {
  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🧪 Experiments</h1>
      <p>Track and manage your scientific experiments efficiently!</p>

      {/* Experiment 1 Tab */}
      <div style={{ marginTop: "20px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{
            padding: "12px 20px",
            fontSize: "16px",
            marginTop: "10px",
            cursor: "pointer"
          }}>
            Experiment 1
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

