export default function PointBadge({ points = 15 }) {
  return (
    <div className="relative top-10 right-10 flex items-center justify-center text-(--brand-green)">
      {/* Grøn neon ring */}
      <div
        className="absolute  w-30 h-30 rounded-full border-6 animate-pulse"
        style={{
          boxShadow: "0 0 14px #06C167, 0 0 60px #06C16788, inset 0 0 14px #06C16722",
        }}
      />

      {/* Tekst */}
      <div className="relative z-10 text-center">
        <h2 className="text-5xl extra-bold">{points}</h2>
        <p>points</p>
      </div>
    </div>
  );
}
