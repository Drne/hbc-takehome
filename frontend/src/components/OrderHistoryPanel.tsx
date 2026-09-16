import {useMemo, useState, type FormEvent, useCallback} from 'react'
import {useCustomers, useOrders, useProducts} from '../hooks'
import type {Employee, Order} from '../types'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {DangerButton, DetailCard, DetailHeader, DetailMeta, Field, FormGrid, Forms, Input, OrderRow, OrdersTable, Panel, PanelTitle, PrimaryButton, SecondaryButton, Select, getProductName, ModalOverlay, ModalBox, ModalHeader, ModalTitle, ModalActions} from './common'
import {useUpdateEvent} from "../hooks/useUpdateEvent";

type OrderHistoryPanelProps = {
  selectedCustomerId: number | null
  currentEmployee: Employee
  employees?: Employee[]
}

export function OrderHistoryPanel({selectedCustomerId, currentEmployee, employees}: OrderHistoryPanelProps) {
  const {customers} = useCustomers()
  const {orders, createOrder, updateOrder, deleteOrder, refetch} = useOrders()

  // If we see an update event for orders, invalidate and refetch the data
  useUpdateEvent('order', refetch)

  const {products} = useProducts()
  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  )
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [orderForm, setOrderForm] = useState({productId: 1, quantity: 1, salesPersonId: 1})
  const [isModalOpen, setIsModalOpen] = useState(false)

  function closeModal() {
    setIsModalOpen(false)
    setEditingOrderId(null)
    setOrderForm({productId: 1, quantity: 1, salesPersonId: 1})
  }

  const findEmployeeName = useCallback((employeeId: number) => {
    const foundEmployee = employees?.find(employee => employee.id === employeeId)

    return foundEmployee ? foundEmployee.name : 'UNKNOWN'
  }, [employees])

  const customerOrders = useMemo(
    () => orders.filter((order) => order.customerId === selectedCustomer?.id),
    [orders, selectedCustomer?.id],
  )

  function beginOrderEdit(order: Order) {
    setEditingOrderId(order.id)
    setOrderForm({productId: order.productId, quantity: order.quantity, salesPersonId: order.salesPersonId})
    setIsModalOpen(true)
  }

  async function saveOrder(event: FormEvent) {
    event.preventDefault()
    if (!selectedCustomer) {
      return
    }

    const payload = {
      SalesPersonID: currentEmployee.id,
      CustomerID: selectedCustomer.id,
      ProductID: orderForm.productId,
      Quantity: Number(orderForm.quantity) || 1,
    }

    if (editingOrderId) {
      await updateOrder(editingOrderId, payload)
    } else {
      await createOrder(payload)
    }

    setEditingOrderId(null)
    setOrderForm({productId: 1, quantity: 1, salesPersonId: 1})
    setIsModalOpen(false)
  }

  async function deleteOrderHandler(orderId: number) {
    await deleteOrder(orderId)
  }

  return (
    <Panel>
      {selectedCustomer ? (
        <DetailCard>
          <DetailHeader>
            <div>
              <PanelTitle>{selectedCustomer.firstName} {selectedCustomer.lastName}</PanelTitle>
              <DetailMeta>Customer history and order entry</DetailMeta>
            </div>
            <PrimaryButton onClick={() => { setEditingOrderId(null); setOrderForm({productId: 1, quantity: 1, salesPersonId: currentEmployee.id}); setIsModalOpen(true); }}>+ New</PrimaryButton>
          </DetailHeader>

          <div>
            <PanelTitle style={{marginBottom: 12}}>Order history</PanelTitle>
            <OrdersTable>
              {customerOrders.length === 0 ? (
                <div style={{color: '#64748b'}}>No orders for this customer yet.</div>
              ) : (
                customerOrders.map((order) => (
                  <OrderRow key={order.id}>
                    <div>
                      <strong>{getProductName(order.productId, products)}</strong>
                      <div style={{color: '#64748b', marginTop: 4}}>Qty {order.quantity}</div>
                    </div>
                    <div style={{color: '#64748b'}}>{`Salesperson ${findEmployeeName(order.salesPersonId)}`}</div>
                    <div style={{display: 'flex', gap: 8}}>
                      <SecondaryButton onClick={() => beginOrderEdit(order)} aria-label={`Edit order ${order.id}`} title="Edit">
                        <EditIcon fontSize="small" />
                      </SecondaryButton>
                      <DangerButton onClick={() => void deleteOrderHandler(order.id)} aria-label={`Delete order ${order.id}`} title="Delete">
                        <DeleteIcon fontSize="small" />
                      </DangerButton>
                    </div>
                  </OrderRow>
                ))
              )}
            </OrdersTable>
          </div>

          {isModalOpen && (
            <ModalOverlay onClick={() => closeModal()}>
              <ModalBox onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>{editingOrderId ? 'Edit order' : 'Create order'}</ModalTitle>
                  <SecondaryButton onClick={() => closeModal()}>Close</SecondaryButton>
                </ModalHeader>

                <Forms onSubmit={(event) => void saveOrder(event)}>
                  <FormGrid>
                    <Field>
                      Product
                      <Select value={orderForm.productId} onChange={(event) => setOrderForm((previous) => ({...previous, productId: Number(event.target.value)}))}>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field>
                      Quantity
                      <Input type="number" min={1} value={orderForm.quantity} onChange={(event) => setOrderForm((previous) => ({...previous, quantity: Number(event.target.value) || 1}))} />
                    </Field>
                  </FormGrid>
                  <Field>
                    Salesperson
                    <Input style={{background: 'lightgray'}} disabled value={findEmployeeName(orderForm.salesPersonId)}/>
                  </Field>
                  <ModalActions>
                    <SecondaryButton type="button" onClick={() => closeModal()}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit">{editingOrderId ? 'Save order' : 'Add order'}</PrimaryButton>
                  </ModalActions>
                </Forms>
              </ModalBox>
            </ModalOverlay>
          )}

        </DetailCard>
      ) : (
        <div style={{color: '#64748b', padding: '24px 0'}}>Select a customer to view their order history.</div>
      )}
    </Panel>
  )
}
