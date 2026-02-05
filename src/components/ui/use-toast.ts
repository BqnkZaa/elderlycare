// Simplified toast hook to prevent build errors if the full one is missing
// In a real shadcn setup this would be more complex
"use client"

import { useState } from "react"

export function useToast() {
    const [toasts, setToasts] = useState<any[]>([])

    const toast = ({ title, description, variant }: any) => {
        // For now, just log to console or simple alert to prompt development of full toast
        console.log(`Toast: ${title} - ${description} (${variant})`)
        alert(`${title}\n${description}`)
    }

    return { toast }
}
