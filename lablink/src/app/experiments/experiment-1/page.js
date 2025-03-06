import Link from "next/link";
import { Home } from "lucide-react"; 

export default function Experiment1Page() {
  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🔬 Experiment 1</h1>
      <p>Details and progress tracking for Experiment 1.</p>

      {/* Centered Tabs for Experiment Sections */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px" }}>
        <Link href="/experiments/experiment-1/equipment-setup">
          <button style={{ margin: "10px", padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Equipment/Setup
          </button>
        </Link>

        <Link href="/experiments/experiment-1/training">
          <button style={{ margin: "10px", padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Training
          </button>
        </Link>

        <Link href="/experiments/experiment-1/data-analysis">
          <button style={{ margin: "10px", padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Data/Analysis
          </button>
        </Link>

        <Link href="/experiments/experiment-1/notes-collaboration">
          <button style={{ margin: "10px", padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Notes/Collaboration
          </button>
        </Link>
      </div>

      {/* Back to Experiments Button (Bottom-left) */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <Link href="/experiments">
          <button style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            Back to Experiments
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

