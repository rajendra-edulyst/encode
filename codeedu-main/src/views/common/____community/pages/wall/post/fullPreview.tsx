import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FullPreviewProps {
  open: boolean;
  onClose: (open: boolean) => void;
  selectedFiles: string[];
  initialIndex: number;
}

const FullPreview = ({ open, onClose, selectedFiles,initialIndex }: FullPreviewProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (api && open) {
      api.scrollTo(initialIndex); 
      setCurrent(initialIndex);    
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }
  }, [api, open, initialIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-auto">
          {/* Close button */}
          <button
            onClick={() => onClose(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="w-full max-w-6xl">
            <Carousel setApi={setApi} className="relative">
              <CarouselContent>
                {selectedFiles?.slice(0, 5)?.map((file, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center max-h-[90vh] max-w-full">
                      <img
                        src={file}
                        alt={`Post image ${index + 1}`}
                        className="max-h-[90vh] max-w-full object-contain rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* show dots */}
              <div className="absolute bottom-2 left-0 right-0 p-2">
                <div className="flex justify-center items-center gap-2 mt-2">
                  {Array.from({ length: selectedFiles?.length || 0 }).map((_, index) => (
                    <button
                      key={index}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        current === index ? "bg-[#00A8E9] w-10" : "w-3 bg-gray-300"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  ))}
                </div>
              </div>

              <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
              <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cblue border border-[#00A8E9]" />
            </Carousel>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FullPreview;
