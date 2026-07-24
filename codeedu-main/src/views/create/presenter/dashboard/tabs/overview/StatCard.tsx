type StatCardProps = {
  title: string
  value: number | string
  change?: number
  isPositive?: boolean
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => {
  return (
    <div className="bg-[#1c1c1c] text-white p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>

      <div className="flex justify-between items-end mt-3">
        <p className="text-3xl font-semibold m-0">{value}</p>

        {change !== undefined && (
          <span
            className={`text-sm ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "▲" : "▼"} {change}%
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
