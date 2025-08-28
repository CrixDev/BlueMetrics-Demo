import React from "react"

const badgeVariants = {
  default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-900 border border-gray-300"
}

function Badge({ className = "", variant = "default", children, ...props }) {
  const variantClasses = badgeVariants[variant] || badgeVariants.default
  
  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${variantClasses} ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
