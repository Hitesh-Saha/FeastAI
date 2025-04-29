import { itemVariants } from "@/lib/static";
import { motion } from "framer-motion";

interface FeatureCardProps {
    title: string,
    description: string,
    Icon: any
}

const FeatureCard = ({title, description, Icon}: FeatureCardProps ) => {
  return (
    <motion.div
      className="p-6 bg-card rounded-4xl shadow-2xl border-b-6 border-r-6 border-base-200 flex flex-col gap-2"
      variants={itemVariants}
    >
      <div className="flex items-start rounded-tl-[5rem] rounded-tr-[4rem] rounded-bl-[5rem] rounded-br-[9rem] bg-base p-2 w-16 h-16"><Icon size={38} /></div>
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-primary text-md">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
