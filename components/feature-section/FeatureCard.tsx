import { itemVariants } from "@/lib/constant";
import { Feature } from "@/schema/common";
import { motion } from "framer-motion";

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <motion.div
      className="p-6 bg-card rounded-4xl shadow-2xl border-b-6 border-r-6 border-base-200 flex flex-col gap-4"
      variants={itemVariants}
    >
      <div className="flex items-start rounded-tl-[5rem] rounded-tr-[4rem] rounded-bl-[5rem] rounded-br-[9rem] bg-base p-2 w-16 h-16">
        <feature.icon size={38} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
        <p className="text-primary text-md">{feature.description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
