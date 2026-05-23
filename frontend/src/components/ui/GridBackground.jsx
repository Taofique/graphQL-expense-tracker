import { cn } from "../../utils/cn";

const GridBackground = ({ children }) => {
  return (
    <div className="w-full bg-black text-white relative overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)]"
        )}
      />

      <div className="absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default GridBackground;
