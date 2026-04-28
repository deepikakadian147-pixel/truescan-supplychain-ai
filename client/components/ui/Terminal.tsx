

import styles from "./Terminal.module.css";

interface TerminalLine {
  prefix?: string;
  text: string;
  color?: "green" | "amber" | "red" | "dim" | "white";
}

interface TerminalProps {
  title?: string;
  lines: TerminalLine[];
  maxHeight?: string;
}

const COLOR_MAP: Record<NonNullable<TerminalLine["color"]>, string> = {
  green: "var(--col-green)",
  amber: "var(--col-amber)",
  red: "var(--col-red)",
  dim: "var(--col-chrome-dim)",
  white: "var(--col-white)",
};

export default function Terminal({ title = "TERMINAL", lines, maxHeight = "300px" }: TerminalProps) {
  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <span className={styles.dotRed} />
          <span className={styles.dotAmber} />
          <span className={styles.dotGreen} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body} style={{ maxHeight }}>
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            {line.prefix && (
              <span className={styles.prefix}>{line.prefix}</span>
            )}
            <span style={{ color: line.color ? COLOR_MAP[line.color] : "inherit" }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
