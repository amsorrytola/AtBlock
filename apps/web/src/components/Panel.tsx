import type { ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className ? `panel ${className}` : "panel"}>
      <header className="panel-head">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Signal({ on, label }: { on: boolean | undefined; label: string }) {
  return (
    <span className={`signal ${on ? "on" : "off"}`}>
      <span className="signal-dot" aria-hidden />
      {label}
    </span>
  );
}
