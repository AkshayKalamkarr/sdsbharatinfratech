'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { titleVariants } from '../../../utils/animation';
import { projects } from '../../../data/residencialprojects';
import Link from 'next/link';
import Image from 'next/image';

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ProjectCard = ({ project }) => (
  <Link href={`/project/residencialprojects/${project.slug}`} className="block">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUpVariant}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-amber-600/20 hover:border-amber-600 cursor-pointer"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority={false}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRseHRsfHx0dHx8dHx8fHx0dHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        </div>
        <div
          onClick={(e) => e.preventDefault()}
          className="mt-auto block"
        >
          <span className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 text-xs sm:text-sm md:text-base inline-block text-center font-medium shadow-sm hover:shadow-md active:scale-98">
            Read More
            <span className="ml-2">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

const HeroSection = () => (
  <div className="relative w-full">
    <div className="absolute inset-0">
      <Image
        src="/images/projects/residencialBackgroundWallpaper.jpg"
        alt="ResidentialProjectsBackground"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
    </div>
    <div className="relative min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center px-4">
      <motion.h1
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true }}
        variants={titleVariants}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-wider text-center max-w-4xl mx-auto"
      >
        Residential Projects
      </motion.h1>
    </div>
  </div>
);

const ResidencialProject = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-16">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={titleVariants}
            className="pt-4 pb-2 sm:pt-6 sm:pb-4"
          >
            {/* Additional title or content can go here */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-10 py-4 sm:py-6 md:py-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidencialProject;