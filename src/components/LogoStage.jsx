import { useRef } from 'react'
import { LogoMark } from './Logo.jsx'

// L'amplitude de l'inclinaison au survol, en degrés.
const MAX_TILT = 14

// La scène 3D à droite de l'accueil, sur grand écran.
// Au repos, le logo tourne lentement ; au survol, il s'incline vers la souris.
// Les mouvements sont dans index.css (`.logo-stage…`) et se coupent si l'appareil
// demande moins de mouvement.
//
// Pour brancher un vrai modèle 3D plus tard : remplacer <LogoMark /> par le canvas
// du modèle. Le cadre, la perspective et l'inclinaison restent tels quels.
export function LogoStage() {
  const stage = useRef(null)

  function handleMove(event) {
    const box = stage.current.getBoundingClientRect()
    // Position de la souris dans le cadre, de -0,5 à 0,5.
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    stage.current.style.setProperty('--tilt-x', `${(-y * 2 * MAX_TILT).toFixed(1)}deg`)
    stage.current.style.setProperty('--tilt-y', `${(x * 2 * MAX_TILT).toFixed(1)}deg`)
  }

  function handleLeave() {
    stage.current.style.removeProperty('--tilt-x')
    stage.current.style.removeProperty('--tilt-y')
  }

  return (
    <div
      ref={stage}
      aria-hidden="true"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="logo-stage rise hidden size-80 shrink-0 items-center justify-center rounded-card border border-line lg:flex"
      style={{ animationDelay: '320ms' }}
    >
      <div className="logo-stage-idle">
        <div className="logo-stage-tilt">
          <LogoMark className="size-40" />
        </div>
      </div>
    </div>
  )
}
