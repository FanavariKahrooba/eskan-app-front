export function BackgroundEffects() {
  return (
    <>
      <div className="absolute left-[-10%] top-[-20%] h-[460px] w-[460px] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </>
  );
}
