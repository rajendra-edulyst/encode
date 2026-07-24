import React from 'react'

interface EmptyStateProps {
  title: string,
  description: string,
  children?: React.ReactNode
}

const EmptyState = ({ title, description, children }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 border rounded-md">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      {children}
    </div>
  )
}

export default EmptyState