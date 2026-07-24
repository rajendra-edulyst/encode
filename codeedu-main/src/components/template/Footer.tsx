import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
// import { APP_NAME } from '@/constants/app.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="flex items-center justify-between flex-auto w-full">
            {/* <span>
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span> all
                rights reserved.
            </span>
            <div className="">
                <a
                    className="text-gray"
                    href="https://elmscodeedu.edulystventures.com/policy"
                    target='_blank'
                    rel='noreferrer'
                >
                    Term & Conditions
                </a>
                <span className="mx-2 text-muted"> | </span>
                <a
                    className="text-gray"
                    href="https://elmscodeedu.edulystventures.com/policy"
                    target='_blank'
                    rel='noreferrer'
                >
                    Privacy & Policy
                </a>
            </div> */}
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center ${pageContainerType === 'contained' ? PAGE_CONTAINER_GUTTER_X + 'h-16' : ''}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
