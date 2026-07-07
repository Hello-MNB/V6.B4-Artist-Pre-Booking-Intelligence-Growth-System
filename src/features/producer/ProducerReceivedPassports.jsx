import { PageShell, Wordmark } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'

export default function ProducerReceivedPassports() {
  const { T } = useLang()
  return (
    <PageShell max="max-w-md">
      <div className="mb-6">
        <Wordmark />
      </div>
      <h1 className="text-xl font-bold text-soft mb-2">{T.producer.receivedTitle}</h1>
      <div className="card">
        <p className="font-bold text-soft mb-2">{T.producer.receivedEmpty}</p>
        <p className="text-sm text-muted">{T.producer.receivedEmptyBody}</p>
      </div>
    </PageShell>
  )
}
