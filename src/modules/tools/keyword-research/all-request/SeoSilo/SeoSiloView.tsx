import { PillarCard } from "./PilarPage";
import { TopicCard } from "./TopicCard";
import { SeoSiloData } from "./types";

interface SeoSiloViewProps {
  data: SeoSiloData;
}

export const SeoSiloView = ({ data }: SeoSiloViewProps) => {
  return (
    <section className='space-y-8'>
      <PillarCard
        url={data.url}
        volume={data.globalVolume}
        kd={data.globalKd}
      />

      <div className='space-y-4'>
        {data.topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
};
