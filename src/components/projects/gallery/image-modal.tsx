import { Dialog, DialogContent } from "@/components/ui/dialog";
import CustomImage from "@/components/ui/image";
import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  image: string | null;
  onClose: () => void;
}

export default function ImageModal({ isOpen, image, onClose }: ImageModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 p-0 max-w-4xl w-full overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-yellow-400 z-10"
        >
          <X size={24} />
        </button>
        <div className="relative w-full h-[80vh]">
          <CustomImage
            src={image}
            alt="Project image"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}