export type ChatMessage = {
    id: string
    employeeName: string
    text: string
    createdAt: string
}
export type Product = {
    id: number
    name: string
    price: number
}

export type Employee = {
    id: number
    name: string
}

export type Customer = {
    id: number
    firstName: string
    middleInitial?: string | null
    lastName: string
}

export type Order = {
    id: number
    salesPersonId: number
    customerId: number
    productId: number
    quantity: number
}