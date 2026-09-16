import styled from 'styled-components'
import type {Employee} from '../types'
import {HeaderRow, LoginShell, PrimaryButton, Title} from './common'

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 24px;
`

const EmployeeCard = styled.button`
  padding: 20px;
  border: 1px solid #d9e0ee;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    border-color: #7c9cff;
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(86, 108, 255, 0.12);
  }
`

const EmployeeName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`

const EmployeeRole = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-size: 0.9rem;
`

type EmployeeSelectorProps = {
  employees: Employee[]
  onSelect: (employee: Employee) => void
  onSwitch?: () => void
}

export function EmployeeSelector({employees, onSelect}: EmployeeSelectorProps) {
  return (
    <LoginShell>
      <HeaderRow>
        <div>
          <Title>Employee Sales Console</Title>
          <p style={{margin: '8px 0 0', color: '#475569'}}>Select your employee profile to continue</p>
        </div>
      </HeaderRow>
      <EmployeeGrid>
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} onClick={() => onSelect(employee)}>
            <EmployeeName>{employee.name}</EmployeeName>
            <EmployeeRole>Sales employee</EmployeeRole>
          </EmployeeCard>
        ))}
      </EmployeeGrid>
      {employees.length === 0 && (
        <div style={{marginTop: 20, color: '#64748b'}}>No employees available yet.</div>
      )}
    </LoginShell>
  )
}
