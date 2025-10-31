import { FeatureManagementRepository } from '@/infraestructure/repositories';
import { FeatureMockService } from '@/infraestructure/services/users/AccessFeaturesMock';
import { useEffect, useState } from 'react';

export function useFeatures() {
  const [features, setFeatures] = useState<
    { id: string; code: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const repository = new FeatureManagementRepository();
  const mockService = new FeatureMockService(repository);

  useEffect(() => {
    const load = async () => {
      await mockService.initialize();
      const all = await repository.findAll();

      const uiFeatures = all.map((f) => ({
        id: f.id,
        code: f.code,
        name: f.name,
      }));

      setFeatures(uiFeatures);
      setLoading(false);
    };
    load();
  }, []);

  return {
    features,
    loading,
    refresh: async () => {
      const all = await repository.findAll();
      setFeatures(all.map((f) => ({ id: f.id, code: f.code, name: f.name })));
    },
  };
}
