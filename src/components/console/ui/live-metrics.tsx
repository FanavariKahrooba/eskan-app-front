"use client"

import { useEffect, useState } from "react"
import { Cpu, HardDrive, Activity } from "lucide-react"

export default function LiveMetrics() {
  const [data, setData] = useState({
    cpu: 20,
    ram: 40,
    req: 120,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        cpu: Math.floor(Math.random() * 90),
        ram: Math.floor(Math.random() * 90),
        req: Math.floor(Math.random() * 800),
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold mb-4">System Metrics</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="flex gap-1">
            <Cpu size={14} />
            CPU
          </span>
          {data.cpu}%
        </div>

        <div className="flex justify-between">
          <span className="flex gap-1">
            <HardDrive size={14} />
            RAM
          </span>
          {data.ram}%
        </div>

        <div className="flex justify-between">
          <span className="flex gap-1">
            <Activity size={14} />
            Requests
          </span>
          {data.req}/min
        </div>
      </div>
    </div>
  )
}
