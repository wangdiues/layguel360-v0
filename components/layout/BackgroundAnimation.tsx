"use client";

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Top-left indigo orb */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.10) 0%, transparent 68%)",
          animation: "drift 24s ease-in-out infinite",
        }}
      />
      {/* Right-center sky-blue orb */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          right: "-140px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(14,165,233,0.07) 0%, transparent 68%)",
          animation: "drift 32s ease-in-out infinite reverse",
        }}
      />
      {/* Bottom-center violet orb */}
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "30%",
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.06) 0%, transparent 68%)",
          animation: "drift 28s ease-in-out infinite 4s",
        }}
      />
    </div>
  );
}
