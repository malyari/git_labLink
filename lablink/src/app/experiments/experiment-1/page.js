import Link from "next/link";
import { Home, Camera, BookOpen, BarChart2, MessageSquare, Activity } from "lucide-react"; 

export default function Experiment1Page() {
  return (
    <main style={{ 
      textAlign: "center", 
      padding: "50px", 
      position: "relative", 
      height: "100vh",
      backgroundColor: "#121212",
      color: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Breadcrumb Navigation (Top-left) */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        fontSize: "16px"
      }}>
        <Link href="/" style={{ 
          color: "white", 
          display: "flex", 
          alignItems: "center",
          textDecoration: "none"
        }}>
          <Home size={20} />
        </Link>
        <span style={{ color: "#666" }}>/</span>
        <Link href="/experiments" style={{ 
          color: "white", 
          textDecoration: "none"
        }}>
          Experiments
        </Link>
        <span style={{ color: "#666" }}>/</span>
        <span style={{ color: "#aaa" }}>Experiment 1</span>
      </div>


      {/* Visual Tab Grid with Icons and Labels */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "30px", 
        maxWidth: "900px", 
        margin: "0 auto"
      }}>
        {/* Photos Tab */}
        <Link href="/experiments/experiment-1/equipment-setup" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <Camera size={64} color="#70d6ff" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Photos</span>
          </div>
        </Link>

        {/* Trainings Tab */}
        <Link href="/experiments/experiment-1/training-guidelines" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <BookOpen size={64} color="#00008B" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Trainings</span>
          </div>
        </Link>

        {/* Data/Analysis Tab */}
        <Link href="/experiments/experiment-1/data-analysis" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <BarChart2 size={64} color="#ff9770" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Data/Analysis</span>
          </div>
        </Link>

        {/* Notes/Collaboration Tab */}
        <Link href="/experiments/experiment-1/notes-collaboration" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <MessageSquare size={64} color="#70ff94" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Notes/Collaboration</span>
          </div>
        </Link>

        {/* Monitoring Devices Tab */}
        <Link href="/experiments/experiment-1/monitoring-devices" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <Activity size={64} color="#e0ff70" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Monitoring Devices</span>
          </div>
        </Link>
      </div>

    </main>
  );
}