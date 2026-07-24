import { FC } from 'react'
import Lottie from 'lottie-react'

type LottieAnimationProps = {
  animationData: object
  loop?: boolean
  className?: string
  opacity?: number // 👈 New prop
}

const LottieAnimation: FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  className = '',
  opacity = 1, // 👈 Default to fully visible
}) => {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={className}
      style={{ opacity }}
    />
  )
}

export default LottieAnimation
