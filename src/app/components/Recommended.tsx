import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Doc } from "../../../convex/_generated/dataModel";

export type RecommendedProps = {
  recco: Doc<"recommendedTasks">;
};

const Recommended: React.FC<RecommendedProps> = (props) => {
  return (
    <OverlayScrollbarsComponent>
      <div className="tw-h-12">{props.recco.reason}</div>
    </OverlayScrollbarsComponent>
  );
};

export default Recommended;
