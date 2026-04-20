import { ActionItem } from "../cards";
import { NoData } from "../ui";

export function ActionItemsSection({ actionItems }) {
  return (
    <div key="actions" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Action Items</h2>
        <p className="text-zinc-400">Recommended next steps for your competitive strategy</p>
      </div>
      {actionItems?.length > 0 ? (
        <div className="grid gap-4">
          {actionItems.map((item, i) => (
            <ActionItem key={i} item={item} index={i} />
          ))}
        </div>
      ) : (
        <NoData message="No specific action items generated." />
      )}
    </div>
  );
}
