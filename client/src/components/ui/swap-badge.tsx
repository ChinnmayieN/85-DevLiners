import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface SwapBadgeProps {
  className?: string;
}

export function SwapBadge({ className }: SwapBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`swap-badge ${className}`}>
          <i className="ri-swap-line mr-1"></i>
          <span>Swap</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">This item is available for swap instead of purchase.</p>
      </TooltipContent>
    </Tooltip>
  );
}
