"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "../../../hooks/useTranslation";
import { getLocalizedPath } from "../../../locales/routes";

const imageVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.2 + i * 0.18,
      ease: "easeOut" as const,
    },
  }),
};

interface GuaranteeInfo {
  title: string;
  description: string;
}

export const SatisfactionGuarantees = () => {
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);

  const images = [
    {
      src: "/images/home/trucks.webp",
      alt: "Route",
      className: "row-span-2 rounded-xl overflow-hidden relative",
    },
    {
      src: "/images/home/landscape.webp",
      alt: "Camions",
      className: "rounded-xl overflow-hidden relative",
    },
    {
      src: "/images/home/computer.webp",
      alt: "Bureau",
      className: "rounded-xl overflow-hidden relative",
    },
  ];

  const guarantee1 = t("homepage.satisfaction.guarantee1") as unknown as GuaranteeInfo;
  const guarantee2 = t("homepage.satisfaction.guarantee2") as unknown as GuaranteeInfo;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texte à gauche */}
        <div data-aos="fade-right">
          <h2
            data-aos="fade-up"
            className="text-primary text-base font-semibold mb-2"
          >
            {t("homepage.satisfaction.badge") as string}
          </h2>
          <h3
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-10"
          >
            {t("homepage.satisfaction.title") as string}
          </h3>

          <div className="flex flex-col gap-8 mb-10">
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex items-center text-left gap-4"
            >
              <span className="flex-shrink-0">
                <Image 
                  src="/icons/shield.png" 
                  alt="Bouclier" 
                  width={48} 
                  height={48} 
                  style={{filter: 'drop-shadow(0 0 2px #5d6ef8)', width: 'auto', height: 'auto'}} 
                />
              </span>
              <div>
                <div className="font-bold text-2xl md:text-3xl text-gray-900 mb-1">{guarantee1.title}</div>
                <div className="text-gray-600 text-base md:text-lg">{guarantee1.description}</div>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex items-center text-left gap-4"
            >
              <span className="flex-shrink-0">
                <Image 
                  src="/icons/answer.png" 
                  alt="Réponse rapide" 
                  width={48} 
                  height={48} 
                  style={{filter: 'drop-shadow(0 0 2px #58468c)', width: 'auto', height: 'auto'}} 
                />
              </span>
              <div>
                <div className="font-bold text-2xl md:text-3xl text-gray-900 mb-1">{guarantee2.title}</div>
                <div className="text-gray-600 text-base md:text-lg">{guarantee2.description}</div>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex justify-center lg:justify-start"
          >
            <Link 
              href={getLocalizedPath('contact', lang)}
              className="bg-primary text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors text-lg flex items-center gap-2"
            >
              {t("homepage.satisfaction.button") as string}
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Images à droite avec effet d'apparition */}
        <div 
          data-aos="fade-left"
          className="grid grid-cols-2 grid-rows-2 gap-4 h-[420px]"
        >
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              className={img.className}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 