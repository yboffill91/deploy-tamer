import { KeywordResultEntity } from "@/core/entities";
import { InfoItem } from "./KeywordInfoItem";

export function KeywordMetadata({ keyword }: { keyword: KeywordResultEntity }) {
  return (
    <div className='grid grid-cols-2 gap-3 text-sm'>
      <InfoItem label='Language' value={keyword.language_code} />
      <InfoItem label='Location' value={keyword.location_code} />
      <InfoItem
        label='Search partners'
        value={keyword.search_partners ? 'Yes' : 'No'}
      />
      <InfoItem label='Competition index' value={keyword.competition_index} />
    </div>
  );
}
