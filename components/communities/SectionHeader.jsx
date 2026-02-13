export default function SectionHeader({ title, actionLabel, onActionClick }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-white text-[22px] font-bold">{title}</h2>
      <button
        onClick={onActionClick}
        className="text-white/66 text-sm font-semibold hover:text-white transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}