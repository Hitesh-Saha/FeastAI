import {
    Dialog,
    DialogContent,
    DialogTitle,
  } from "@/components/ui/dialog"
import { LoaderCircle } from "lucide-react";
  
interface LoadingCardProps {
    openModal: boolean;
}

const LoadingCard = ({openModal}: LoadingCardProps) => {
  return (
    <Dialog open={openModal}>
        <DialogContent className="bg-base-secondary rounded-4xl p-10 shadow-2xl border-none w-74 flex flex-col gap-5 items-center justify-center text-center" showCloseButton={false}>
            <DialogTitle className="text-xl font-bold text-white"> We are making your recipe...</DialogTitle>
            <LoaderCircle size={40} strokeWidth={4} className="animate-spin" />
        </DialogContent>
    </Dialog>
    )
}

export default LoadingCard