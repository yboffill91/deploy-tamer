import { useQuery } from '@tanstack/react-query';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';

const repo = new KeywordResearchApiRepository();

export function useGoogleSnapshot(keyword: string | null) {
  return useQuery({
    queryKey: ['google-snapshot', keyword],
    queryFn: () => repo.googleSearchWord(keyword!),
    enabled: !!keyword,
  });
}
