import { KeywordLeaf } from "./types";

interface KeywordListProps {
  keywords: KeywordLeaf[];
}

export const KeywordList = ({ keywords }: KeywordListProps) => {
  if (keywords.length === 0) return null;

  return (
    <ul className='space-y-1 text-sm'>
      {keywords.map((kw) => (
        <li
          key={kw.keyword}
          className='flex justify-between rounded-md bg-background px-3 py-2'
        >
          <span>{kw.keyword}</span>
          <span className='text-muted-foreground'>
            Vol {kw.volume} · KD {kw.kd}
          </span>
        </li>
      ))}
    </ul>
  );
};
