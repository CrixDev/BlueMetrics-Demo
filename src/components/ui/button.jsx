import React from "react"

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "hover:bg-gray-100 text-gray-900",
  link: "text-blue-600 underline-offset-4 hover:underline",
  social: "border border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
}

function Button({ 
  className = "", 
  variant = "default", 
  size = "default", 
  children, 
  asChild = false,
  href,
  target,
  rel,
  ...props 
}) {
  const variantClasses = buttonVariants[variant] || buttonVariants.default
  const sizeClasses = buttonSizes[size] || buttonSizes.default
  
  const baseClasses = `inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses} ${sizeClasses} ${className}`
  
  // Si se proporciona href, renderizar como link
  if (href) {
    return (
      <a 
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : rel}
        className={baseClasses}
        {...props}
      >
        {children}
      </a>
    )
  }
  
  // Si asChild es true, renderizar solo las clases para ser usado con otros componentes
  if (asChild) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${children.props.className || ''}`,
      ...props
    })
  }
  
  // Renderizar como botón normal
  return (
    <button 
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
