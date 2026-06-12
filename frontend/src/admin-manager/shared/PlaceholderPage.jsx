import { Construction } from 'lucide-react'
import PageHeader from './PageHeader'

export default function PlaceholderPage({ title, description }) {
  return (
    <div>
      <PageHeader title={title} subtitle={description} />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6">
          <Construction size={40} className="text-primary" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          This section is under development and will be available soon.
        </p>
      </div>
    </div>
  )
}
