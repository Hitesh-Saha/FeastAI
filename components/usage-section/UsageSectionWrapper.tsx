import { containerVariants, usageList } from "@/lib/constant"
import { motion } from "framer-motion"
import UsageCard from "./UsageCard"

const UsageSectionWrapper = () => {
  return (
    <section className="py-10 mt-6">
      <motion.div
        variants={containerVariants}
        className="flex flex-col gap-4 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        >
          <h1 className="text-4xl text-base-secondary font-bold text-center">
            How It Works
          </h1>
          <h3 className="text-lg text-primary text-center">
            Generate Delicious Recipes in just a few simple steps!
          </h3>
          <motion.div
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={containerVariants}
          >
              {usageList.map((usage, index) => (
                <UsageCard key={index} item={usage}/>
              ))}
          </motion.div>
        </motion.div>
    </section>
  )
}

export default UsageSectionWrapper