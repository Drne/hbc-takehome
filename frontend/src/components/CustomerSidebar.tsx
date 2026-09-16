import { useEffect, useState, FormEvent } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Customer } from '../types';
import {
  CustomerButton,
  CustomerList,
  DangerButton,
  Field,
  FormGrid,
  Forms,
  Input,
  Panel,
  PanelHeader,
  PanelTitle,
  PrimaryButton,
  SecondaryButton,
  ModalOverlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  ModalActions,
  formatCustomerName,
} from './common';
import { CustomerInput } from '../hooks/useCustomers';

interface CustomerSidebarProps {
  selectedCustomerId: number | null;
  onSelect: (id: number | null) => void;
  customers: Customer[];
  createCustomer: (newCustomer: CustomerInput) => Promise<Customer>;
  updateCustomer: (id: number, customer: CustomerInput) => Promise<Customer>;
  deleteCustomer: (id: number) => void;
}

export function CustomerSidebar({
  selectedCustomerId, onSelect, customers, updateCustomer, deleteCustomer, createCustomer,
}: CustomerSidebarProps) {
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [customerForm, setCustomerForm] = useState(
    { firstName: '', middleInitial: '', lastName: '' },
  );
  const [formErrors, setFormErrors] = useState<{ firstName?: string; middleInitial?: string; lastName?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
    setEditingCustomerId(null);
    setCustomerForm({ firstName: '', middleInitial: '', lastName: '' });
    setFormErrors({});
  }

  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      onSelect(customers[0].id);
    }
  }, [customers, onSelect, selectedCustomerId]);

  function beginCustomerEdit(customer: Customer) {
    setEditingCustomerId(customer.id);
    setCustomerForm({
      firstName: customer.firstName,
      middleInitial: customer.middleInitial ?? '',
      lastName: customer.lastName,
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function validateCustomerForm() {
    const nextErrors: { firstName?: string; middleInitial?: string; lastName?: string } = {};
    const firstName = customerForm.firstName.trim();
    const middleInitial = customerForm.middleInitial.trim();
    const lastName = customerForm.lastName.trim();

    if (!firstName) {
      nextErrors.firstName = 'First name is required.';
    }

    if (middleInitial && middleInitial.length !== 1) {
      nextErrors.middleInitial = 'Middle initial must be one character.';
    }

    if (!lastName) {
      nextErrors.lastName = 'Last name is required.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function saveCustomer(event: FormEvent) {
    event.preventDefault();

    if (!validateCustomerForm()) {
      return;
    }

    const payload = {
      FirstName: customerForm.firstName.trim(),
      MiddleInitial: customerForm.middleInitial.trim() || null,
      LastName: customerForm.lastName.trim(),
    };

    if (editingCustomerId) {
      await updateCustomer(editingCustomerId, payload);
    } else {
      await createCustomer(payload);
    }

    setEditingCustomerId(null);
    setCustomerForm({ firstName: '', middleInitial: '', lastName: '' });
    setFormErrors({});
    setIsModalOpen(false);
  }

  async function deleteCustomerHandler(customerId: number) {
    await deleteCustomer(customerId);

    const nextCustomers = customers.filter((customer) => customer.id !== customerId);
    onSelect(nextCustomers[0]?.id ?? null);
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Customers</PanelTitle>
        <PrimaryButton
          onClick={() => {
            setEditingCustomerId(null);
            setCustomerForm({ firstName: '', middleInitial: '', lastName: '' });
            setFormErrors({});
            setIsModalOpen(true);
          }}
        >
          + New
        </PrimaryButton>
      </PanelHeader>

      <CustomerList>
        {customers.map((customer) => (
          <div key={customer.id} style={{ display: 'flex', gap: 8 }}>
            <CustomerButton selected={selectedCustomerId === customer.id} onClick={() => onSelect(customer.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                {formatCustomerName(customer)}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <SecondaryButton onClick={() => beginCustomerEdit(customer)} aria-label={`Edit ${customer.firstName} ${customer.lastName}`} title="Edit">
                    <EditIcon style={{ height: '15px', width: '15px' }} />
                  </SecondaryButton>
                  <DangerButton onClick={() => void deleteCustomerHandler(customer.id)} aria-label={`Delete ${customer.firstName} ${customer.lastName}`} title="Delete">
                    <DeleteIcon style={{ height: '15px', width: '15px' }} />
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

            <Forms onSubmit={(event) => void saveCustomer(event)} noValidate>
              <FormGrid>
                <Field>
                  First name
                  <Input
                    value={customerForm.firstName}
                    aria-invalid={Boolean(formErrors.firstName)}
                    required
                    onChange={(event) => {
                      setCustomerForm((previous) => ({ ...previous, firstName: event.target.value }));
                      setFormErrors((previous) => ({ ...previous, firstName: undefined }));
                    }}
                    style={formErrors.firstName ? { borderColor: '#ef4444' } : undefined}
                  />
                  {formErrors.firstName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.firstName}</span>}
                </Field>
                <Field>
                  Middle initial
                  <Input
                    value={customerForm.middleInitial}
                    aria-invalid={Boolean(formErrors.middleInitial)}
                    maxLength={1}
                    onChange={(event) => {
                      const nextMiddleInitial = event.target.value.slice(0, 1);
                      setCustomerForm((previous) => ({ ...previous, middleInitial: nextMiddleInitial }));
                      setFormErrors((previous) => ({ ...previous, middleInitial: undefined }));
                    }}
                    style={formErrors.middleInitial ? { borderColor: '#ef4444' } : undefined}
                  />
                  {formErrors.middleInitial && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.middleInitial}</span>}
                </Field>
              </FormGrid>
              <Field>
                Last name
                <Input
                  value={customerForm.lastName}
                  aria-invalid={Boolean(formErrors.lastName)}
                  required
                  onChange={(event) => {
                    setCustomerForm((previous) => ({ ...previous, lastName: event.target.value }));
                    setFormErrors((previous) => ({ ...previous, lastName: undefined }));
                  }}
                  style={formErrors.lastName ? { borderColor: '#ef4444' } : undefined}
                />
                {formErrors.lastName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.lastName}</span>}
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
  );
}


