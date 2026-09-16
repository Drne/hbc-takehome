import {useState} from 'react'
import {createGlobalStyle} from 'styled-components'
import {ChatPanel} from './components/ChatPanel'
import {CustomerSidebar} from './components/CustomerSidebar'
import {EmployeeSelector} from './components/EmployeeSelector'
import {OrderHistoryPanel} from './components/OrderHistoryPanel'
import {AppShell, HeaderRow, Page, SecondaryButton, Title} from './components/common'
import {useEmployees} from './hooks'
import type {Employee} from './types'

const GlobalStyle = createGlobalStyle`
 * { box-sizing: border-box; }
 html, body, #root {
   height: 100%;
 }
 body {
   margin: 0;
   min-height: 100vh;
   overflow: hidden;
   font-family: Inter, 'Segoe UI', sans-serif;
   background: linear-gradient(180deg, #f5f7fb 0%, #eef2ff 100%);
   color: #1f2a37;
 }
 button, input, select {
   font: inherit;
 }
`

export default function App() {
 const {employees} = useEmployees()
 const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
 const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

 if (!currentEmployee) {
   return (
     <>
       <GlobalStyle />
       <Page>
         <EmployeeSelector employees={employees} onSelect={setCurrentEmployee} />
       </Page>
     </>
   )
 }

 return (
   <>
     <GlobalStyle />
     <Page>
       <HeaderRow>
         <div>
           <Title>Employee Sales Console</Title>
           <div style={{color: '#475569', marginTop: 6}}>Logged in as {currentEmployee.name}</div>
         </div>
         <SecondaryButton onClick={() => setCurrentEmployee(null)}>Switch employee</SecondaryButton>
       </HeaderRow>

       <AppShell>
         <CustomerSidebar selectedCustomerId={selectedCustomerId} onSelect={setSelectedCustomerId} />
         <OrderHistoryPanel selectedCustomerId={selectedCustomerId} currentEmployee={currentEmployee} employees={employees} />
         <ChatPanel currentEmployee={currentEmployee} />
       </AppShell>
     </Page>
   </>
 )
}
