import { containerVariants, features } from "@/lib/static";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const FeatureWrapper = () => {
  return (
    <section className="bg-[#9e6e7c2e] rounded-4xl py-10 mt-6">
        <motion.div
        variants={containerVariants}
        className="flex flex-col gap-4 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        >
            <h1 className="text-4xl text-base-secondary font-bold text-center">
                Features of FeastAI
            </h1>
            <h3 className="text-lg text-primary text-center">
                Strong features to assist you in creating dishes that are both healthy
                and tasty
            </h3>
            <motion.div
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
            >
                {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    feature={feature}
                />
                ))}
            </motion.div>
        </motion.div>
    </section>
  );
};

export default FeatureWrapper;
