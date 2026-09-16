import styled from 'styled-components'
import type {Customer, Order, Product} from '../types'

export const Page = styled.div`
  height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const LoginShell = styled.div`
  max-width: 720px;
  margin: 64px auto;
  padding: 32px;
  background: rgba(255,255,255,0.9);
  border: 1px solid #dfe7f5;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`

export const AppShell = styled.div`
  flex: 1;
  min-height: 0;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: rgba(255,255,255,0.9);
  border: 1px solid #dfe7f5;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  padding: 20px;
  overflow: scroll;
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
`

export const PrimaryButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
`

export const SecondaryButton = styled.button`
  border: 1px solid #dfe7f5;
  background: white;
  color: #334155;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
`

export const DangerButton = styled.button`
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
`

export const Forms = styled.form`
  display: grid;
  gap: 12px;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  color: #475569;
  font-weight: 600;
`

export const Input = styled.input`
  border: 1px solid #dfe7f5;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalBox = styled.section`
  background: rgba(255,255,255,0.98);
  border: 1px solid #dfe7f5;
  border-radius: 12px;
  padding: 20px;
  width: 480px;
  max-width: calc(100% - 32px);
  box-shadow: 0 18px 45px rgba(15,23,42,0.08);
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`

export const Select = styled.select`
  border: 1px solid #dfe7f5;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
`

export const OrdersTable = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
`

export const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr auto;
  gap: 12px;
  align-items: center;
  border: 1px solid #edf1ff;
  border-radius: 12px;
  background: #f8faff;
  padding: 12px 14px;
`

export const CustomerList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
`

export const CustomerButton = styled.button<{ selected: boolean }>`
  width: 100%;
  border: 1px solid ${({ selected }) => (selected ? '#7c9cff' : '#dfe7f5')};
  border-radius: 12px;
  background: ${({ selected }) => (selected ? '#edf2ff' : '#fff')};
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  color: #1f2a37;
  overflow-wrap: anywhere;
`

export const DetailCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
`

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const DetailMeta = styled.div`
  color: #475569;
  font-size: 0.9rem;
`

export const ChatBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
`

export const ChatFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
`

export const ChatBubble = styled.div`
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 10px 12px;
`

export const ChatMeta = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 4px;
`

export function formatCustomerName(customer: Customer) {
  return `${customer.firstName} ${customer.middleInitial ? `${customer.middleInitial}.` : ''} ${customer.lastName}`.replace(/\s+/g, ' ').trim()
}

export function getProductName(productId: number, products: Product[]) {
  return products.find((product) => product.id === productId)?.name ?? 'Unknown product'
}

export function getCustomerOrderCount(orders: Order[], customerId: number | null) {
  return orders.filter((order) => order.customerId === customerId).length
}
