import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import appConfig from '@/configs/app.config';
import NewLogo from '@/assets/images/New_Logo.png';

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={
                    type === 'full'
                        ? NewLogo
                        : `${LOGO_SRC_PATH}logo-${mode}-${type}.png?v=${appConfig.appVersion}`
                }
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
