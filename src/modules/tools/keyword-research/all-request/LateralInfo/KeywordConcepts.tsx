import { Badge } from "@/components/ui";

export function KeywordConcepts({ concepts }: { concepts: string[] }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground mb-2'>Concepts</p>
      <div className='flex flex-wrap gap-2'>
        {concepts.map((concept) => (
          <Badge key={concept} variant='secondary'>
            {concept}
          </Badge>
        ))}
      </div>
    </div>
  );
}
