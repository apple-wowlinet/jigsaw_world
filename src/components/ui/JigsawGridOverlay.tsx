/**
 * Classic knob-and-socket jigsaw outlines to overlay on a picture.
 * Interior grid edges are drawn as mushroom-shaped connectors so adjacent
 * pieces interlock; direction alternates per edge for a natural layout.
 * Rendered as a stretched SVG — use on a container with `relative`.
 */
export function JigsawGridOverlay({
  rows = 4,
  cols = 4,
  className,
  stroke = 'rgba(255,255,255,0.9)',
  strokeWidth = 1.2,
}: {
  rows?: number
  cols?: number
  className?: string
  stroke?: string
  strokeWidth?: number
}) {
  const CELL = 100
  const width = cols * CELL
  const height = rows * CELL
  const paths: string[] = []

  // Horizontal interior edge with a mushroom knob pointing up or down.
  // Geometry per 100-unit edge: base opening 41→59, neck pinched to 44→56,
  // bulb spanning 37→63 (centered 50, protruding 27) — wider than the neck,
  // with a slight collar flare where it meets the base line.
  const hTab = (x: number, y: number, up: boolean) => {
    const s = up ? -1 : 1
    return [
      `M ${x} ${y}`,
      `L ${x + 41} ${y}`,
      `C ${x + 42} ${y + 3 * s} ${x + 43} ${y + 5 * s} ${x + 44} ${y + 8 * s}`,
      `C ${x + 43} ${y + 11 * s} ${x + 37} ${y + 11 * s} ${x + 37} ${y + 15 * s}`,
      `C ${x + 37} ${y + 22 * s} ${x + 43} ${y + 27 * s} ${x + 50} ${y + 27 * s}`,
      `C ${x + 57} ${y + 27 * s} ${x + 63} ${y + 22 * s} ${x + 63} ${y + 15 * s}`,
      `C ${x + 63} ${y + 11 * s} ${x + 57} ${y + 11 * s} ${x + 56} ${y + 8 * s}`,
      `C ${x + 57} ${y + 5 * s} ${x + 58} ${y + 3 * s} ${x + 59} ${y}`,
      `L ${x + CELL} ${y}`,
    ].join(' ')
  }

  // Vertical interior edge with a mushroom knob pointing left or right.
  const vTab = (x: number, y: number, left: boolean) => {
    const s = left ? -1 : 1
    return [
      `M ${x} ${y}`,
      `L ${x} ${y + 41}`,
      `C ${x + 3 * s} ${y + 42} ${x + 5 * s} ${y + 43} ${x + 8 * s} ${y + 44}`,
      `C ${x + 11 * s} ${y + 43} ${x + 11 * s} ${y + 37} ${x + 15 * s} ${y + 37}`,
      `C ${x + 22 * s} ${y + 37} ${x + 27 * s} ${y + 43} ${x + 27 * s} ${y + 50}`,
      `C ${x + 27 * s} ${y + 57} ${x + 22 * s} ${y + 63} ${x + 15 * s} ${y + 63}`,
      `C ${x + 11 * s} ${y + 63} ${x + 11 * s} ${y + 57} ${x + 8 * s} ${y + 56}`,
      `C ${x + 5 * s} ${y + 57} ${x + 3 * s} ${y + 58} ${x} ${y + 59}`,
      `L ${x} ${y + CELL}`,
    ].join(' ')
  }

  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      paths.push(hTab(c * CELL, r * CELL, (r + c) % 2 === 0))
    }
  }
  for (let c = 1; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      paths.push(vTab(c * CELL, r * CELL, (r + c) % 2 === 0))
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
