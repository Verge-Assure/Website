import { forwardRef } from 'react'
import './HeroTitleHover.css'

const HeroTitleHover = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="hero-title">
    <div className="title-line-wrapper">
      <div className="title-line title-line--default">VERGE</div>
      <div className="title-line title-line--alt">INSURANCE</div>
    </div>
    <div className="title-line-wrapper">
      <div className="title-line title-line--default">ASSURE</div>
      <div className="title-line title-line--alt title-line--delay">PROBLEM</div>
    </div>
    <div className="title-line-wrapper title-line-wrapper--expand">
      <div className="title-line title-line--alt title-line--delay2">SOLVED</div>
    </div>
  </div>
))

HeroTitleHover.displayName = 'HeroTitleHover'

export default HeroTitleHover
