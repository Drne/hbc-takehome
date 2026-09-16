import { useCallback, useEffect, useState } from 'react';
import { useApiContext } from '../context/ApiContext';
import type { Product } from '../types';

export interface ProductInput {
  name: string;
  price: number;
}

const normalizeProduct = (record: Partial<Product> & Record<string, unknown>): Product => ({
  id: Number(record.ProductID ?? record.id ?? 0),
  name: String(record.Name ?? record.name ?? ''),
  price: Number(record.Price ?? record.price ?? 0),
});

export function useProducts() {
  const apiUrl = useApiContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/products`);
      if (!response.ok) {
        throw new Error(`Failed to load products (${response.status})`);
      }

      const payload = (await response.json()) as Record<string, unknown>[];
      setProducts(payload.map(normalizeProduct));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('Failed to load products'));
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const createProduct = useCallback(
    async (input: ProductInput) => {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Product create failed (${response.status})`);
      }

      const createdProduct = normalizeProduct((await response.json()) as Record<string, unknown>);
      setProducts((previous) => [...previous, createdProduct]);
      return createdProduct;
    },
    [apiUrl],
  );

  const updateProduct = useCallback(
    async (productId: number, input: ProductInput) => {
      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Product update failed (${response.status})`);
      }

      const updatedProduct = normalizeProduct((await response.json()) as Record<string, unknown>);
      setProducts((previous) => previous.map((product) => (product.id === productId ? updatedProduct : product)));
      return updatedProduct;
    },
    [apiUrl],
  );

  const deleteProduct = useCallback(
    async (productId: number) => {
      const response = await fetch(`${apiUrl}/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Product delete failed (${response.status})`);
      }

      setProducts((previous) => previous.filter((product) => product.id !== productId));
      return true;
    },
    [apiUrl],
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return {
    products, loading, error, refetch: fetchProducts, createProduct, updateProduct, deleteProduct,
  };
}
