// hooks/useCustomer.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { customerApi } from '@/lib/api/customer';
import { CustomerMeResponse } from '@/lib/api/types';
import { useCustomerStore } from '@/stores/use-customer-store';

export function useCustomer() {
  const { setCustomerData } = useCustomerStore();

  const customerQuery = useQuery<CustomerMeResponse>({
    queryKey: ['customer'],
    queryFn: customerApi.getCustomer,
  });

  useEffect(() => {
    if (customerQuery.data) {
      setCustomerData(customerQuery.data);
    }
  }, [customerQuery.data, setCustomerData]);

  return {
    data: customerQuery.data,
    error: customerQuery.error,
    loading: customerQuery.isLoading,
    refetch: customerQuery.refetch,
  };
}
