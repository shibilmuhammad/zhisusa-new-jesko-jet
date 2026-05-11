"use client";



interface SectionTransitionProps {
  direction?: "top" | "bottom" | "both";
  intensity?: "light" | "medium" | "heavy";
}

export function SectionTransition({
  direction = "both",
  intensity = "medium",
}: SectionTransitionProps) {
  const opacityMap = {
    light: "from-background/40",
    medium: "from-background/70",
    heavy: "from-background",
  };

  return (
    <div className="relative w-full pointer-events-none" aria-hidden="true">
      {(direction === "top" || direction === "both") && (
        <div
          className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${opacityMap[intensity]} to-transparent z-10`}
        />
      )}
      {(direction === "bottom" || direction === "both") && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${opacityMap[intensity]} to-transparent z-10`}
        />
      )}
    </div>
  );
}
