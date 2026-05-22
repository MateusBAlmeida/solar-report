type Props = {
  title: string
  value: string
  subtitle?: string
}

export function ResultCard({
  title,
  value,
  subtitle
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-slate-200">

      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

      {subtitle && (
        <p className="text-sm text-slate-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  )
}