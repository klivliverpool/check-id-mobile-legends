import { Atmosphere } from '@/components/mlbb/atmosphere'
import { LookupExperience } from '@/components/mlbb/lookup-experience'

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Atmosphere />
      <LookupExperience />
    </div>
  )
}
