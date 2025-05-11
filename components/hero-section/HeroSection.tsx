import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { containerVariants, itemLeftFadeVariants, itemVariants } from "@/lib/constant";
import { CustomButton } from "@/components/CustomButton";

const HeroSection = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto text-center flex flex-col gap-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-center"
        variants={itemVariants}
      >
        <img src={'/Logo.svg'} className="h-20 w-20" />
      </motion.div>

      <motion.h1
        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-base-foreground to-primary-foreground bg-clip-text text-transparent"
        variants={itemVariants}
      >
        AI Recipe Generator
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-base-foreground"
        variants={itemVariants}
      >
        Transform your ingredients into delicious recipes with the power of AI
      </motion.p>

      <div className="flex justify-between mt-8 items-center gap-16 lg:gap-8 px-4 flex-col lg:flex-row">
        <motion.div className="w-full lg:w-1/2 flex flex-col gap-4 items-center lg:items-start" variants={itemLeftFadeVariants}>
            <h1 className="text-5xl font-bold text-center md:text-left">Create Delicious</h1>
            <h1 className="text-5xl font-bold text-center md:text-left">Recipes in Seconds!</h1>
            <h3 className="text-xl text-center md:text-left">Enter your ingredients, choose your preferences, and let our AI create the perfect recipe for you.</h3>
            <div className="mt-6 flex gap-4">
                <Link href={"/login"}>
                    <Button
                        size="lg"
                        variant="outline"
                        className="cursor-pointer bg-overlay rounded-full"
                    >
                        Login
                    </Button>
                </Link>
                <Link href={"/signup"}>
                    <CustomButton
                    >
                      <span>Get Started</span> <ArrowRight size={36} />
                    </CustomButton>
                </Link>
            </div>
        </motion.div>
        <div className="w-full lg:w-1/2 flex gap-2 justify-center">
          <div className="flex flex-col gap-2">
            <div className="w-48 h-20 md:w-56 md:h-24 lg:w-80 lg:h-36 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image3.jpg"} alt={""} className="w-full h-full object-cover rounded-full"/></div>
            <div className="flex gap-2 justify-around">
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-36 lg:h-36 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image5.jpg"} alt={""} className="w-full h-full object-fill rounded-full"/></div>
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-36 lg:h-36 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image4.jpg"} alt={""} className="w-full h-full object-fill rounded-full"/></div>
            </div>
            <div className="w-48 h-20 md:w-56 md:h-24 lg:w-80 lg:h-36 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image1.jpg"} alt={""} className="w-full h-full object-cover rounded-full"/></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-36 lg:h-36 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image2.jpg"} alt={""} className="w-full h-full object-fill rounded-full"/></div>
            <div className="w-20 h-48 md:w-24 md:h-56 lg:w-36 lg:h-80 flex rounded-full border-2 border-base-secondary"><img src={"/hero-image6.jpg"} alt={""} className="w-full h-full object-fill rounded-full"/></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default HeroSection;
