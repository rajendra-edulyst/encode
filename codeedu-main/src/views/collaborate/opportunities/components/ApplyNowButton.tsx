type ApplyNowButtonProps = {
    disabled?: boolean
    applied?: boolean
    expired?: boolean
    loading?: boolean
    onClick: () => void
}

const ApplyNowButton = ({
    disabled = false,
    applied = false,
    expired = false,
    loading = false,
    onClick,
}: ApplyNowButtonProps) => {
    const isDisabled = disabled || loading || applied || expired

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={onClick}
            className={`h-[90px] w-[155px] rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 shadow-lg ${
                isDisabled
                    ? 'bg-[#5A5A5A] text-white/90 cursor-not-allowed opacity-70'
                    : 'bg-primary text-black hover:bg-[#6da538] cursor-pointer'
            }`}
        >
            {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-r-transparent" />
            ) : (
                <>
                    {!applied && !expired && (
                        <img
                            src="/img/arrow_right_alt.png"
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-5 object-contain"
                        />
                    )}
                    <span className="leading-snug text-center">
                        {applied ? 'Applied' : expired ? 'Expired' : 'Apply Now'}
                    </span>
                </>
            )}
        </button>
    )
}

export default ApplyNowButton
