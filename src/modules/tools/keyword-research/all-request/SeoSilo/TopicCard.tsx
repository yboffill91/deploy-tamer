'use client'

import { useState } from "react";
import { TopicNode } from "./types";
import {IntentBadge, Metric} from './Metric'
import { KeywordList } from "./KeywordList";

interface TopicCardProps {
  topic: TopicNode;
  level?: number;
}

export const TopicCard = ({ topic, level = 0 }: TopicCardProps) => {
  const [open, setOpen] = useState(false);
//   const hasChildren = topic.keywords.length > 0 || topic.children?.length;

  return (
    <div
      className='rounded-lg border bg-muted/30'
      style={{ marginLeft: level * 24 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className='w-full p-4 flex items-center justify-between'
      >
        <div className='text-left'>
          <h3 className='font-medium'>{topic.path}</h3>
          <div className='mt-1 flex gap-4 text-xs text-muted-foreground'>
            <Metric label='Vol' value={topic.volume} />
            <Metric label='KD' value={topic.kd} />
            <IntentBadge intent={topic.searchIntent} />
          </div>
        </div>

        <span className='text-muted-foreground'>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className='px-4 pb-4 space-y-4'>
          <KeywordList keywords={topic.keywords} />

          {topic.children?.map((child) => (
            <TopicCard key={child.id} topic={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
