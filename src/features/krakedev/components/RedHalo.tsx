export function RedHalo() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.12) 0%, transparent 70%)',
      }}
    />
  )
}
