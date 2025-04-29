import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CustomButtonProps {
    children: ReactNode,
    className?: string;
}

export function CustomButton({children, className, ...props}: ComponentProps<'button'> & CustomButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
        type="submit"
        className={cn("bg-base cursor-pointer rounded-full border-4 border-base-secondary p-4 uppercase flex items-center", className)}
        {...props}
        >
            {children}
        </Button>
    </motion.div>
  )
}