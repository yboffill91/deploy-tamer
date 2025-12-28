import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface MockData {
  url: string;
  globalVolume: number;
  globalKd: number;
  topics: {
    id: string;
    path: string;
    volume: number;
    kd: number;
    searchIntent: 'TRANSACTIONAL' | 'INFORMATIONAL';
    keywords: {
      keyword: string;
      volume: number;
      kd: number;
    }[];
  }[];
}


interface HierarchyTreeProps {
  data: MockData;
}

export const HierarchyTree = ({ data }: HierarchyTreeProps) => {
  return (
    <div className='space-y-4'>
      <TreeRoot url={data.url} volume={data.globalVolume} kd={data.globalKd} />

      <Separator />

      <div className='space-y-1'>
        {data.topics.map((topic) => (
          <TopicNode key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};


interface TreeRootProps {
  url: string;
  volume: number;
  kd: number;
}

const TreeRoot = ({ url, volume, kd }: TreeRootProps) => {
  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm font-medium'>{url}</span>
      <span className='text-xs text-muted-foreground'>
        Vol {volume} · KD {kd}
      </span>
    </div>
  );
};


interface TopicNodeProps {
  topic: MockData['topics'][number];
}

const TopicNode = ({ topic }: TopicNodeProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='pl-4'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-muted'
      >
        {open ? (
          <ChevronDown className='h-4 w-4 text-muted-foreground' />
        ) : (
          <ChevronRight className='h-4 w-4 text-muted-foreground' />
        )}

        <span className='font-medium'>{topic.path}</span>

        <span className='ml-auto flex items-center gap-2 text-xs text-muted-foreground'>
          <span>Vol {topic.volume}</span>
          <span>KD {topic.kd}</span>
          <IntentBadge intent={topic.searchIntent} />
        </span>
      </button>

      {open && (
        <div className='ml-6 mt-1 space-y-1 border-l pl-4'>
          {topic.keywords.map((kw) => (
            <KeywordLeaf key={kw.keyword} keyword={kw} />
          ))}
        </div>
      )}
    </div>
  );
};


interface KeywordLeafProps {
  keyword: {
    keyword: string;
    volume: number;
    kd: number;
  };
}

const KeywordLeaf = ({ keyword }: KeywordLeafProps) => {
  return (
    <div className='flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-muted/50'>
      <span>{keyword.keyword}</span>
      <span className='text-xs text-muted-foreground'>
        Vol {keyword.volume} · KD {keyword.kd}
      </span>
    </div>
  );
};


const IntentBadge = ({
  intent,
}: {
  intent: 'TRANSACTIONAL' | 'INFORMATIONAL';
}) => {
  return (
    <Badge
      variant={intent === 'INFORMATIONAL' ? 'info' : 'success'}
      
    >
      {intent}
    </Badge>
  );
};
