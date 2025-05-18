import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface EcoScoreProps {
  score: number;
  className?: string;
}

export function EcoScore({ score, className }: EcoScoreProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`eco-score-badge ${className}`}>
          <i className="ri-leaf-line mr-1"></i>
          <span>Eco Score: {score}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-xs">
          <p className="text-sm">
            Eco Score measures the environmental impact savings from buying second-hand.
          </p>
          <p className="text-xs mt-1">Higher score = Greater positive impact</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
