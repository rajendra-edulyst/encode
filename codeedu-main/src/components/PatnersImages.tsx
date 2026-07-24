import { useEffect, useMemo, useState } from 'react'
import { usePatners } from '@/hooks/data/usePatners'

interface Partner {
    id: number
    name: string
    description: string
    short_code: string
    image: string
    organization_id: number
    url: string
}

const PatnersImages: React.FC = () => {
    const { data: patners } = usePatners()

    const allPartners = useMemo<Partner[]>(() => patners ?? [], [patners])
    const visiblePartners = useMemo<Partner[]>(() => allPartners.slice(0, 16), [allPartners])
    const totalBoxes = 16
    const visibleCountPerCycle = 8
    const [activeTiles, setActiveTiles] = useState<Array<Partner | null>>(
        Array.from({ length: totalBoxes }, () => null)
    )

    useEffect(() => {
        if (!visiblePartners.length) {
            setActiveTiles(Array.from({ length: totalBoxes }, () => null))
            return
        }

        const shuffle = <T,>(items: T[]) => {
            const copy = [...items]
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[copy[i], copy[j]] = [copy[j], copy[i]]
            }
            return copy
        }

        const renderBatch = (startIndex: number) => {
            const batchSize = Math.min(visibleCountPerCycle, visiblePartners.length, totalBoxes)
            const nextTiles: Array<Partner | null> = Array.from({ length: totalBoxes }, () => null)

            const selectedPartners = Array.from({ length: batchSize }, (_, idx) => {
                const partnerIndex = (startIndex + idx) % visiblePartners.length
                return visiblePartners[partnerIndex]
            })
            const randomPositions = shuffle(Array.from({ length: totalBoxes }, (_, i) => i)).slice(0, batchSize)

            randomPositions.forEach((tileIdx, idx) => {
                nextTiles[tileIdx] = selectedPartners[idx]
            })

            setActiveTiles(nextTiles)
        }

        let batchStart = 0
        renderBatch(batchStart)
        const interval = setInterval(() => {
            batchStart = (batchStart + visibleCountPerCycle) % visiblePartners.length
            renderBatch(batchStart)
        }, 3500)

        return () => clearInterval(interval)
    }, [visiblePartners])

    return (
        <div
            className="grid grid-cols-4 w-full max-w-[460px] aspect-square"
        >
            {activeTiles.map((partner, index) =>
                partner ? (
                    <a
                        key={`${partner.id}-${index}`}
                        href={partner.url || '/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square overflow-hidden rounded-sm border border-white/10 bg-[#111] p-2 flex items-center justify-center"
                        title={partner.name}
                    >
                        <img
                            src={partner.image}
                            alt={partner.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                        />
                    </a>
                ) : (
                    <div
                        key={`placeholder-${index}`}
                        className="aspect-square rounded-sm border border-white/10 bg-[#111]"
                    />
                )
            )}
        </div>
    )
}

export default PatnersImages
