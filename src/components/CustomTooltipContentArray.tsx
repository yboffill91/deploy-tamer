export const CustomTooltipContent = ({ values }: { values: string[] }) => {
  return (
    <div className='flex items-center justify-start flex-wrap gap-2'>
      {values.length === 0 && <p>Nothing Selected</p>}
      {values.length > 0 &&
        values
          .slice(0, 5)
          .map((val, idx) => <span key={idx + val}>{val}</span>)}
      {values.length > 5 && <span>... and {values.length - 5} more</span>}
    </div>
  );
};
