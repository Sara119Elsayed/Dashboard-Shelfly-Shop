'use client'

export default function ChartPlaceholder({ title }) {
  return (
    <div style={{ height: 240, border: '1px dashed #ccc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>{title ?? 'Chart area (add Chart.js or Recharts)'}</div>
    </div>
  )
}
