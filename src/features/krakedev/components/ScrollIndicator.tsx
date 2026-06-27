import { ChevronDown } from 'lucide-react'

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 z-10 text-white/40">
      <ChevronDown className="size-6 animate-scroll-bounce" />
    </div>
  )
}
