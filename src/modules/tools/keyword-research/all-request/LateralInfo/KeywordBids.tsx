import { KeywordResultEntity } from "@/core/entities";
import { InfoItem } from "./KeywordInfoItem";

export function KeywordBids({ keyword }: { keyword: KeywordResultEntity }) {
  return (
    <div className='grid grid-cols-2 gap-3 text-sm'>
      <InfoItem
        label='Low top of page'
        value={
          keyword.low_top_of_page_bid
            ? `$${keyword.low_top_of_page_bid.toFixed(2)}`
            : '—'
        }
      />
      <InfoItem
        label='High top of page'
        value={
          keyword.high_top_of_page_bid
            ? `$${keyword.high_top_of_page_bid.toFixed(2)}`
            : '—'
        }
      />
    </div>
  );
}
