/**
 * CrossMark — фирменный знак Christos.
 * Современный геометричный крест (без иконографии), наследует currentColor.
 * Серверобезопасен (без хуков); анимацию навешивает родитель.
 */
export function CrossMark({
  className,
  strokeWidth = 1.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      role="img"
      aria-label="Крест Christos"
      className={className}
    >
      {/* вертикаль — чуть длиннее, точка пересечения выше центра (каноничные пропорции) */}
      <line
        x1="12"
        y1="1.5"
        x2="12"
        y2="30.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* горизонталь */}
      <line
        x1="3"
        y1="10.5"
        x2="21"
        y2="10.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
