import {useCallback, useEffect, useState} from 'react'
import {useApiContext} from '../context/ApiContext'
import type {Employee} from '../types'

export type EmployeeInput = {
  firstName: string
  middleInitial?: string | null
  lastName: string
}

const normalizeEmployee = (record: Partial<Employee> & Record<string, unknown>): Employee => {
  const firstName = String(record.FirstName ?? record.firstName ?? '')
  const lastName = String(record.LastName ?? record.lastName ?? '')
  const middleInitial = record.MiddleInitial ?? record.middleInitial
  const nameParts = [firstName, middleInitial ? `${String(middleInitial)}.` : '', lastName].filter(Boolean)

  return {
    id: Number(record.EmployeeID ?? record.id ?? 0),
    name: nameParts.join(' ').trim(),
  }
}

export function useEmployees() {
  const apiUrl = useApiContext()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/employees`)
      if (!response.ok) {
        throw new Error(`Failed to load employees (${response.status})`)
      }

      const payload = (await response.json()) as Array<Record<string, unknown>>
      setEmployees(payload.map(normalizeEmployee))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('Failed to load employees'))
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  const createEmployee = useCallback(
    async (input: EmployeeInput) => {
      const response = await fetch(`${apiUrl}/employees`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Employee create failed (${response.status})`)
      }

      const createdEmployee = normalizeEmployee((await response.json()) as Record<string, unknown>)
      setEmployees((previous) => [...previous, createdEmployee])
      return createdEmployee
    },
    [apiUrl],
  )

  const updateEmployee = useCallback(
    async (employeeId: number, input: EmployeeInput) => {
      const response = await fetch(`${apiUrl}/employees/${employeeId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Employee update failed (${response.status})`)
      }

      const updatedEmployee = normalizeEmployee((await response.json()) as Record<string, unknown>)
      setEmployees((previous) => previous.map((employee) => (employee.id === employeeId ? updatedEmployee : employee)))
      return updatedEmployee
    },
    [apiUrl],
  )

  const deleteEmployee = useCallback(
    async (employeeId: number) => {
      const response = await fetch(`${apiUrl}/employees/${employeeId}`, {method: 'DELETE'})
      if (!response.ok) {
        throw new Error(`Employee delete failed (${response.status})`)
      }

      setEmployees((previous) => previous.filter((employee) => employee.id !== employeeId))
      return true
    },
    [apiUrl],
  )

  useEffect(() => {
    void fetchEmployees()
  }, [fetchEmployees])

  return {employees, loading, error, refetch: fetchEmployees, createEmployee, updateEmployee, deleteEmployee}
}
