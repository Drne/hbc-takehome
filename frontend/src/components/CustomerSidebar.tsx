import {useEffect, useState, type FormEvent} from 'react'
import {useCustomers} from '../hooks'
import type {Customer} from '../types'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {CustomerButton, CustomerList, DangerButton, Field, FormGrid, Forms, Input, Panel, PanelHeader, PanelTitle, PrimaryButton, SecondaryButton, ModalOverlay, ModalBox, ModalHeader, ModalTitle, ModalActions, formatCustomerName} from './common'
import {useUpdateEvent} from "../hooks/useUpdateEvent";

type CustomerSidebarProps = {
  selectedCustomerId: number | null
  onSelect: (id: number | null) => void
}

export function CustomerSidebar({selectedCustomerId, onSelect}: CustomerSidebarProps) {
  const {customers, createCustomer, updateCustomer, deleteCustomer, refetch} = useCustomers()

  // If we see an update event for customer, invalidate and refetch the data
  useUpdateEvent('customer', refetch);

  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null)
  const [customerForm, setCustomerForm] = useState({firstName: '', middleInitial: '', lastName: ''})
  const [isModalOpen, setIsModalOpen] = useState(false)

  function closeModal() {
    setIsModalOpen(false)
    setEditingCustomerId(null)
    setCustomerForm({firstName: '', middleInitial: '', lastName: ''})
  }

  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      onSelect(customers[0].id)
    }
  }, [customers, onSelect, selectedCustomerId])

  function beginCustomerEdit(customer: Customer) {
    setEditingCustomerId(customer.id)
    setCustomerForm({
      firstName: customer.firstName,
      middleInitial: customer.middleInitial ?? '',
      lastName: customer.lastName,
    })
    setIsModalOpen(true)
  }

  async function saveCustomer(event: FormEvent) {
    event.preventDefault()

    const payload = {
      FirstName: customerForm.firstName,
      MiddleInitial: customerForm.middleInitial || null,
      LastName: customerForm.lastName,
    }

    if (editingCustomerId) {
      await updateCustomer(editingCustomerId, payload)
    } else {
      await createCustomer(payload)
    }

    setEditingCustomerId(null)
    setCustomerForm({firstName: '', middleInitial: '', lastName: ''})
    setIsModalOpen(false)
  }

  async function deleteCustomerHandler(customerId: number) {
    await deleteCustomer(customerId)

    const nextCustomers = customers.filter((customer) => customer.id !== customerId)
    onSelect(nextCustomers[0]?.id ?? null)
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Customers</PanelTitle>
        <PrimaryButton
          onClick={() => {
            setEditingCustomerId(null)
            setCustomerForm({firstName: '', middleInitial: '', lastName: ''})
            setIsModalOpen(true)
          }}
        >
          + New
        </PrimaryButton>
      </PanelHeader>

      <CustomerList>
        {customers.map((customer) => (
          <div key={customer.id} style={{display: 'flex', gap: 8}}>
            <CustomerButton selected={selectedCustomerId === customer.id} onClick={() => onSelect(customer.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                {formatCustomerName(customer)}
                <div style={{ display: 'flex', gap: '2px'}}>
                  <SecondaryButton onClick={() => beginCustomerEdit(customer)} aria-label={`Edit ${customer.firstName} ${customer.lastName}`} title="Edit">
                    <EditIcon style={{height: '15px', width: '15px'}}/>
                  </SecondaryButton>
                  <DangerButton onClick={() => void deleteCustomerHandler(customer.id)} aria-label={`Delete ${customer.firstName} ${customer.lastName}`} title="Delete">
                    <DeleteIcon style={{ height: '15px', width: '15px'}} />
                  </DangerButton>
                </div>
              </div>
            </CustomerButton>
          </div>
        ))}
      </CustomerList>

      {isModalOpen && (
        <ModalOverlay onClick={() => closeModal()}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingCustomerId ? 'Edit customer' : 'Create customer'}</ModalTitle>
              <SecondaryButton onClick={() => closeModal()}>Close</SecondaryButton>
            </ModalHeader>

            <Forms onSubmit={(event) => void saveCustomer(event)}>
              <FormGrid>
                <Field>
                  First name
                  <Input value={customerForm.firstName} onChange={(event) => setCustomerForm((previous) => ({...previous, firstName: event.target.value}))} />
                </Field>
                <Field>
                  Middle initial
                  <Input value={customerForm.middleInitial} onChange={(event) => setCustomerForm((previous) => ({...previous, middleInitial: event.target.value}))} />
                </Field>
              </FormGrid>
              <Field>
                Last name
                <Input value={customerForm.lastName} onChange={(event) => setCustomerForm((previous) => ({...previous, lastName: event.target.value}))} />
              </Field>
              <ModalActions>
                <SecondaryButton type="button" onClick={() => closeModal()}>Cancel</SecondaryButton>
                <PrimaryButton type="submit">{editingCustomerId ? 'Save customer' : 'Create customer'}</PrimaryButton>
              </ModalActions>
            </Forms>
          </ModalBox>
        </ModalOverlay>
      )}
    </Panel>
  )
}
