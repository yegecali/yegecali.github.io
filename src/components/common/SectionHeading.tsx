interface SectionHeadingProps {
  eyebrow?: string
  title: string
  marker: string
  titleId?: string
}

export default function SectionHeading({ eyebrow, title, marker, titleId }: SectionHeadingProps) {
  const heading = <h2 id={titleId}>{title}</h2>
  return (
    <div className="section-top" data-aos="portfolio-up">
      {eyebrow ? (
        <div>
          <span className="eyebrow">{eyebrow}</span>
          {heading}
        </div>
      ) : (
        heading
      )}
      <span>{marker}</span>
    </div>
  )
}
