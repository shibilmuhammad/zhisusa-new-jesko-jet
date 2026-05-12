export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.015]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0 1px, transparent 1px)",
        backgroundSize: "3px 3px, 4px 4px",
        transform: "translateZ(0)",
      }}
      aria-hidden="true"
    />
  );
}
