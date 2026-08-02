import type { ReactElement } from "react";

export default function PanelContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactElement;
}) {
  return (
    <aside
      className={`text-[0.65rem] max-w-[200px] flex flex-col w-full p-4 bg-linear-[to_bottom,_#cc5500,_#ffa333] ${className}`}
    >
      {children}
    </aside>
  );
}
