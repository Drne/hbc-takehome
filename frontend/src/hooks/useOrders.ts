import { useCallback, useEffect, useState } from 'react';
import { useApiContext } from '../context/ApiContext';
import type { Order } from '../types';

export interface OrderInput {
  SalesPersonID: number;
  CustomerID: number;
  ProductID: number;
  Quantity?: number;
}

const normalizeOrder = (record: Partial<Order> & Record<string, unknown>): Order => ({
  id: Number(record.OrderID ?? record.id ?? 0),
  salesPersonId: Number(record.SalesPersonID ?? record.salesPersonId ?? 0),
  customerId: Number(record.CustomerID ?? record.customerId ?? 0),
  productId: Number(record.ProductID ?? record.productId ?? 0),
  quantity: Number(record.Quantity ?? record.quantity ?? 0),
});

export function useOrders() {
  const apiUrl = useApiContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/orders`);
      if (!response.ok) {
        throw new Error(`Failed to load orders (${response.status})`);
      }

      const payload = (await response.json()) as Record<string, unknown>[];
      setOrders(payload.map(normalizeOrder));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('Failed to load orders'));
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const createOrder = useCallback(
    async (input: OrderInput) => {
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Order create failed (${response.status})`);
      }

      const createdOrder = normalizeOrder((await response.json()) as Record<string, unknown>);
      setOrders((previous) => [...previous, createdOrder]);
      return createdOrder;
    },
    [apiUrl],
  );

  const updateOrder = useCallback(
    async (orderId: number, input: OrderInput) => {
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Order update failed (${response.status})`);
      }

      const updatedOrder = normalizeOrder((await response.json()) as Record<string, unknown>);
      setOrders((previous) => previous.map((order) => (order.id === orderId ? updatedOrder : order)));
      return updatedOrder;
    },
    [apiUrl],
  );

  const deleteOrder = useCallback(
    async (orderId: number) => {
      const response = await fetch(`${apiUrl}/orders/${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Order delete failed (${response.status})`);
      }

      setOrders((previous) => previous.filter((order) => order.id !== orderId));
      return true;
    },
    [apiUrl],
  );

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return {
    orders, loading, error, refetch: fetchOrders, createOrder, updateOrder, deleteOrder,
  };
}
