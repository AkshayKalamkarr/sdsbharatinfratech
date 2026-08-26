'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { titleVariants } from '../../../utils/animation';
import { guestprojects } from '../../../data/guesthousedata';
import Link from 'next/link';
import Image from 'next/image';

const ProjectCard = ({ project }) => {
  return (
    <Link href={`/project/guesthouse/${project.slug}`}>
      <motion.div
        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-amber-600/20 hover:border-amber-600 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={project.image}
            layout="fill"
            objectFit="cover"
            alt={project.title}
            className="transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Button Container */}
          <div
            onClick={(e) => e.preventDefault()}
            className="mt-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-700 to-yellow-600 text-white rounded-lg hover:from-amber-800 hover:to-yellow-700 transition-all duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
            >
              Read More
              <span className="ml-2">→</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const GuestProject = () => {
  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center">
        <Image
          src="/images/home/guestHouse.jpg"
          alt="Guest House Projects Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.h1
          initial="offscreen"
          whileInView="onscreen"
          variants={titleVariants}
          className="container relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-wider text-center px-4"
        >
          Guest House Projects
        </motion.h1>
      </div>

      {/* Projects Grid Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12 lg:py-16">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            variants={titleVariants}
            className="max-w-2xl mx-auto text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Discover Our Featured Projects
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10">
            {guestprojects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestProject;