export default function LabelWithBullet({ label, children, className }) {
  const bulletWidth = "1.1em"; // fixed width for bullet alignment

  return (
    <div className={className}>
      <div>
        <span
          style={{
            display: "inline-block",
            width: bulletWidth,
          }}
        >
          •
        </span>
        <strong>{label}</strong>
      </div>
      <div
        style={{
          paddingLeft: bulletWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
}
