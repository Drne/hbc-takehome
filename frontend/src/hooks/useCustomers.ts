import { useCallback, useEffect, useState } from 'react';
import { useApiContext } from '../context/ApiContext';
import type { Customer } from '../types';

export interface CustomerInput {
  FirstName: string;
  MiddleInitial?: string | null;
  LastName: string;
}

const normalizeCustomer = (record: Partial<Customer> & Record<string, unknown>): Customer => ({
  id: Number(record.CustomerID ?? record.id ?? 0),
  firstName: String(record.FirstName ?? record.firstName ?? ''),
  middleInitial: (record.MiddleInitial ?? record.middleInitial ?? null) as string | null,
  lastName: String(record.LastName ?? record.lastName ?? ''),
});

export function useCustomers() {
  const apiUrl = useApiContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/customers`);
      if (!response.ok) {
        throw new Error(`Failed to load customers (${response.status})`);
      }

      const payload = (await response.json()) as Record<string, unknown>[];
      setCustomers(payload.map(normalizeCustomer));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('Failed to load customers'));
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const createCustomer = useCallback(
    async (input: CustomerInput) => {
      const response = await fetch(`${apiUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Customer create failed (${response.status})`);
      }

      const createdCustomer = normalizeCustomer((await response.json()) as Record<string, unknown>);
      setCustomers((previous) => [...previous, createdCustomer]);
      return createdCustomer;
    },
    [apiUrl],
  );

  const updateCustomer = useCallback(
    async (customerId: number, input: CustomerInput) => {
      const response = await fetch(`${apiUrl}/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Customer update failed (${response.status})`);
      }

      const updatedCustomer = normalizeCustomer((await response.json()) as Record<string, unknown>);
      setCustomers((previous) => previous.map((customer) => (customer.id === customerId ? updatedCustomer : customer)));
      return updatedCustomer;
    },
    [apiUrl],
  );

  const deleteCustomer = useCallback(
    async (customerId: number) => {
      const response = await fetch(`${apiUrl}/customers/${customerId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Customer delete failed (${response.status})`);
      }

      setCustomers((previous) => previous.filter((customer) => customer.id !== customerId));
      return true;
    },
    [apiUrl],
  );

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers, loading, error, refetch: fetchCustomers, createCustomer, updateCustomer, deleteCustomer,
  };
}
