interface RowProps {
  label: string;
  value: string;
  op?: string;
  delay: number;
  highlight?: boolean;
}

function WorkingRow({ label, value, op = '', delay, highlight = false }: RowProps) {
  return (
    <div
      className={`work-row${highlight ? ' highlight' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="work-op">{op}</span>
      <span className="work-label">{label}</span>
      <span className="work-value mono">{value}</span>
    </div>
  );
}

interface Props {
  deposit: number;
  duty: number;
  other: number;
  leftover: number;
  savings: number;
  animDeposit: number;
  animDuty: number;
}

function fmt(n: number) {
  return '$' + Math.max(0, Math.round(n)).toLocaleString('en-AU');
}

export function WorkingOut({ other, leftover, savings, animDeposit, animDuty }: Props) {
  return (
    <div className="working">
      <div className="working-head">
        <h3>Working out</h3>
      </div>
      <div className="working-rows">
        <WorkingRow label="Required deposit"    value={fmt(animDeposit)} delay={0} />
        <WorkingRow label="Stamp duty"           value={fmt(animDuty)}   delay={80}  op="+" />
        <WorkingRow label="Other costs"          value={fmt(other)}      delay={160} op="+" />
        <WorkingRow label="Leftover savings"     value={fmt(leftover)}   delay={240} op="+" />
        <div className="working-divider" />
        <WorkingRow label="Recalculated savings" value={fmt(savings)}    delay={320} op="=" highlight />
      </div>
    </div>
  );
}
