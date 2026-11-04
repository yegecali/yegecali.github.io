export default function Tags({ items }: { items: readonly string[] }) {
  return (
    <div className="tags">
      {items.map(item => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}
