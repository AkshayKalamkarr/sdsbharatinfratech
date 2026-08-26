"use client";
import { useState, useEffect } from "react";
import {
  Archive, Columns4, Component, DoorOpen, CircleSlash2, PaintBucket, CookingPotIcon, House, Wallpaper, Bath, Frame, InspectionPanel, BedSingle, Fence, LampCeiling, Dumbbell,
  Lightbulb
} from 'lucide-react';
import { projects } from "../../../../data/residencialprojects";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProjectNotFound from "@/components/ProjectNotFoundResidencial";

const getProjectBySlug = (slug) => {
  return projects.find((project) => project.slug === slug);
};

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [fullViewImage, setFullViewImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!project) {
    return <ProjectNotFound />;
  }

  const openFullView = (image) => {
    setFullViewImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeFullView = () => {
    setFullViewImage(null);
    document.body.style.overflow = 'auto';
  };

  const highlightsIcon = {
    Archive, Columns4, Component, DoorOpen, CircleSlash2, PaintBucket, Fence, LampCeiling, Lightbulb, Dumbbell,
    CookingPotIcon, House, Wallpaper, Bath, Frame, InspectionPanel, BedSingle
  };

  return (
    <div className={`bg-gradient-to-b from-white-100 to-white min-h-screen md:mt-36 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full">
        <section className='py-8 px-4 sm:px-6 lg:px-8 transform transition-all duration-700 hover:scale-[1.02]'>
          <div className='flex flex-col lg:flex-row items-start mx-auto w-full'>
            <div className='lg:w-1/2 lg:pr-6 text-center transform transition-all duration-500 hover:translate-y-[-5px]'>
              <h1 className='text-2xl md:text-5xl font-bold mb-4 text-amber-800 text-center lg:text-center md:my-8 md:ml-24
                animate-fadeIn'>
                {project.title}
              </h1>
              <p className='mb-4 text-sm md:text-base text-black lg:text-center lg:ml-24
                transform transition-all duration-500 hover:translate-y-[-3px]'>
                {project.fullDescription}
              </p>
            </div>
            <div className='lg:w-2/2 mt-4 lg:mt-0 lg:ml-36'>
              <div
                className='cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-lg'
                onClick={() => openFullView(project.image)}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className='w-full h-auto object-cover rounded-lg transition-transform duration-300'
                />
              </div>
            </div>
          </div>
        </section>

        {(project.galleryImages || project.videos) && (
          <section className='bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 w-full 
            transform transition-all duration-700 hover:shadow-lg'>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-amber-800 md:my-6
              transform transition-all duration-500 hover:scale-105">
              Gallery
            </h2>
            <div className="w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-amber-700 mx-auto mb-8
              transition-all duration-500 hover:w-48"></div>

            {project.videos && project.videos.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.videos.map((video, index) => (
                    <div key={index} className="relative aspect-video w-full transform transition-all duration-500 
                      hover:scale-105 hover:shadow-xl">
                      <video
                        className="w-full h-full rounded-lg object-cover"
                        controls
                        poster={video.thumbnail}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p className="mt-2 text-center text-gray-700">{video.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.galleryImages && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 md:mt-16 w-full'>
                {project.galleryImages.map((galleryImage, index) => (
                  <div
                    key={index}
                    className='relative overflow-hidden aspect-square w-full cursor-pointer
                      transform transition-all duration-500 hover:scale-105 hover:shadow-xl'
                    onClick={() => openFullView(galleryImage.image)}
                  >
                    <Image
                      src={galleryImage.image}
                      alt={galleryImage.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className='object-cover transition-all duration-500 hover:scale-110'
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {project.highlights && (
          <div className="bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 w-full 
            transform transition-all duration-700 hover:shadow-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-amber-800 md:my-6
              transform transition-all duration-500 hover:scale-105">
              Project Highlights
            </h2>
            <div className="w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-amber-700 mx-auto mb-8
              transition-all duration-500 hover:w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full">
              {project.highlights.map((item, index) => {
                const IconComponent = highlightsIcon[item.icon];
                return (
                  <div
                    key={index}
                    className="lg:my-8 flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md
                      transform transition-all duration-500 hover:scale-110 hover:shadow-xl"
                  >
                    {IconComponent && (
                      <IconComponent className="w-8 h-8 mb-4 text-cyan-700 transition-transform duration-300 hover:scale-125" />
                    )}
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <section className='bg-white py-12 px-4 sm:px-6 lg:px-8 w-full
          transform transition-all duration-700 hover:shadow-lg'>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-orange-800 md:my-6
            transform transition-all duration-500 hover:scale-105">
            Configuration
          </h2>
          <div className="w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-cyan-600 mx-auto mb-8
            transition-all duration-500 hover:w-48"></div>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg
              transform transition-all duration-500 hover:shadow-xl">
              <thead>
                <tr className="bg-navy-700 text-black md:text-center">
                  <th className="py-3 px-4 text-left md:text-center">Approx Area</th>
                  <th className="py-3 px-4 text-left md:text-center">Project duration</th>
                  <th className="py-3 px-4 text-left md:text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {project.configuration.map((config, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100
                    transition-all duration-300">
                    <td className="py-3 px-4 md:text-center">{config.flat}</td>
                    <td className="py-3 px-4 md:text-center">{config.carpet}</td>
                    <td className="py-3 px-4 md:text-center">
                      <Link href="/contact"
                        className="bg-gradient-to-r from-amber-700 to-yellow-600 hover:bg-cyan-700 
                          text-white font-bold py-2 px-4 rounded 
                          transition-all duration-300 hover:scale-110 hover:shadow-lg 
                          transform hover:-translate-y-1">
                        Get Quote
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {fullViewImage && (
          <div
            className='fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50
              animate-fadeIn'
            onClick={closeFullView}
          >
            <div className='relative w-full h-full max-w-5xl max-h-5xl p-4
              transform transition-all duration-500 scale-100'>
              <Image
                src={fullViewImage}
                alt='Full view'
                fill={true}
                style={{ objectFit: "contain" }}
                className="transition-all duration-500"
              />
              <button
                className='absolute top-4 right-4 text-white text-4xl 
                  transition-all duration-300 hover:text-red-600 hover:scale-125 md:text-6xl'
                onClick={closeFullView}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}