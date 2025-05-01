import { itemVariants } from '@/lib/static'
import { Usage } from '@/schema/common'
import { motion } from 'framer-motion'
import React from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface UsageCardProps {
    item: Usage
}

const UsageCard = ({ item }: UsageCardProps) => {
  return (
    <motion.div
    className="p-10 py-14 bg-[#9e6e7c2e] rounded-4xl shadow-2xl flex flex-col gap-12 items-center justify-between"
    variants={itemVariants}
  >
    <AspectRatio ratio={16/6} className="rounded-2xl overflow-hidden w-72 flex items-center justify-center mx-auto border-4 border-base-secondary">
        <img
            src={item.imageUrl || '/usage-image1.png'}
            alt={item.title}
            className="w-full h-full object-contain"
        />
    </AspectRatio>
    <div className="flex flex-col gap-2 items-center justify-center">
        <h3 className="text-xl font-bold mb-2 text-primary">{item.title}</h3>
        <p className="text-primary text-md">{item.description}</p>
    </div>
  </motion.div>
  )
}

export default UsageCard