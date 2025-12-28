import { Metric } from "./Metric";

interface PillarCardProps {
  url: string;
  volume: number;
  kd: number;
}

export const PillarCard = ({ url, volume, kd }: PillarCardProps) => (
    <div className='rounded-xl border bg-card p-6 shadow-sm'>
        <h2 className='text-xl font-semibold'>{url}</h2>

        <div className='mt-4 flex gap-6 text-sm text-muted-foreground'>
            <Metric label='Global Volume' value={volume} />
            <Metric label='Global KD' value={kd} />
        </div>
    </div>
);
