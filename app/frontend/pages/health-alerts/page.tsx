'use client'

import { redirect } from 'next/navigation'

export default function HealthAlertsRedirect() {
  redirect('/')
  return null
}
