import { useState } from "react";
import {
  Fence, FlipHorizontal, BetweenVerticalStart, Lightbulb, Armchair, Component, Wallpaper, Home, Activity, Banknote, FileCheck, CheckSquare, Dumbbell, Utensils, House, GraduationCap,
  LampCeiling, Library, Scale3D, Layers2, Waves, ShowerHead, Lamp, InspectionPanel, Pickaxe, LampCeilingIcon, Columns2, Palette, Timer, Sticker, AudioLines, LogIn, Book, FlipHorizontal2,
  PanelBottom, History, Sprout, Coffee, HandCoins, Users, Presentation, Leaf, BrickWall,
  LeafyGreen
} from "lucide-react";
import { projects } from "../../../../data/commercialprojects";
import { useParams, Link } from "react-router-dom";
// import ProjectNotFound from "../../../../components/ProjectNotFoundCommercial";

const getProjectBySlug = (slug) => {
  return projects.find((project) => project.slug === slug);
};

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [fullViewImage, setFullViewImage] = useState(null);

  // if (!project) {
  //   return <ProjectNotFound />;
  // }

  const openFullView = (image) => {
    setFullViewImage(image);
  };

  const closeFullView = () => {
    setFullViewImage(null);
  };

  const highlightsIcon = {
    Banknote: Banknote,
    FileCheck: FileCheck,
    CheckSquare: CheckSquare,
    FlipHorizontal: FlipHorizontal,
    BetweenVerticalStart: BetweenVerticalStart,
    Lightbulb: Lightbulb,
    Activity: Activity,
    Armchair: Armchair,
    Wallpaper: Wallpaper,
    Component: Component,
    Fence: Fence,
    Dumbbell: Dumbbell,
    Utensils: Utensils,
    House: House,
    GraduationCap: GraduationCap,
    LampCeiling: LampCeiling,
    Home: Home,
    Library: Library,
    Scale3D: Scale3D,
    Layers2: Layers2,
    Waves: Waves,
    ShowerHead: ShowerHead,
    Lamp: Lamp,
    Pickaxe: Pickaxe,
    InspectionPanel: InspectionPanel,
    LampCeilingIcon: LampCeilingIcon,
    Columns2: Columns2,
    Palette: Palette,
    Timer: Timer,
    Sticker: Sticker,
    AudioLines: AudioLines,
    LogIn: LogIn,
    Book: Book,
    FlipHorizontal2: FlipHorizontal2,
    PanelBottom: PanelBottom,
    History: History,
    Sprout: Sprout,
    Coffee: Coffee,
    HandCoins: HandCoins,
    Users: Users,
    Presentation: Presentation,
    Leaf: Leaf,
    BrickWall: BrickWall,
    LeafyGreen: LeafyGreen
  };

  return (
    <div className='bg-gradient-to-b from-white-100 to-white min-h-screen md:mt-36'>
      <div className='w-full'>
        {/* Hero Section */}
        <section className='py-8 px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row items-start mx-auto w-full'>
            <div className='lg:w-1/2 lg:pr-6 text-center'>
              <h1 className='text-2xl md:text-5xl font-bold mb-4 text-amber-800 text-center lg:text-center md:my-8 md:ml-24'>
                {project.title}
              </h1>
              <p className='mb-4 text-sm md:text-base text-black lg:text-center lg:ml-24'>
                {project.fullDescription}
              </p>
            </div>
            <div className='lg:w-2/2 mt-4 lg:mt-0 lg:ml-36'>
              <div
                className='cursor-pointer transition-transform duration-300 hover:scale-105'
                onClick={() => openFullView(project.image)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  loading="lazy"
                  className='w-full h-auto object-cover rounded-lg'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {(project.galleryImages || project.videos) && (
          <section className='bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 w-full'>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-amber-800 md:my-6'>
              Gallery
            </h2>
            <div className='w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-amber-700 mx-auto mb-8'></div>

            {/* Videos Section */}
            {project.videos && project.videos.length > 0 && (
              <div className='mb-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {project.videos.map((video, index) => (
                    <div key={index} className='relative aspect-video w-full'>
                      <video
                        className='w-full h-full rounded-lg object-cover'
                        controls
                        poster={video.thumbnail}
                      >
                        <source src={video.url} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                      <p className='mt-2 text-center text-gray-700'>
                        {video.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {project.galleryImages && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 md:mt-16 w-full'>
                {project.galleryImages.map((galleryImage, index) => (
                  <div
                    key={index}
                    className='relative overflow-hidden aspect-square w-full cursor-pointer'
                    onClick={() => openFullView(galleryImage.image)}
                  >
                    <img
                      src={galleryImage.image}
                      alt={galleryImage.alt}
                      loading="lazy"
                      className='absolute inset-0 w-full h-full object-contain transition duration-300 ease-in-out hover:scale-105'
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Highlights Section */}
        {project.highlights && (
          <div className='bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 w-full'>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-amber-800 md:my-6">
              Project Highlights
            </h2>
            <div className="w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-amber-700 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full">
              {project.highlights.map((item, index) => {
                const IconComponent = highlightsIcon[item.icon];
                return (
                  <div
                    key={index}
                    className="lg:my-8 flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    {IconComponent && <IconComponent className="w-8 h-8 mb-4 text-cyan-700" />}
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Configuration Section */}
        <section className='bg-white py-12 px-4 sm:px-6 lg:px-8 w-full'>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-xl mb-8 text-center text-orange-800 md:my-6">
            Configuration
          </h2>
          <div className="w-36 h-1 bg-gradient-to-r bg-amber-700 hover:bg-cyan-600 mx-auto mb-8"></div>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-navy-700 text-black md:text-center">
                  <th className="py-3 px-4 text-left md:text-center">Approx Area</th>
                  <th className="py-3 px-4 text-left md:text-center">Project duration</th>
                  <th className="py-3 px-4 text-left md:text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {project.configuration.map((config, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4 md:text-center">{config.flat}</td>
                    <td className="py-3 px-4 md:text-center">{config.carpet}</td>
                    <td className="py-3 px-4 md:text-center">
                      <Link to="/contact" className="bg-gradient-to-r from-amber-700 to-yellow-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                        Get Quote
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* Full View Modal */}
        {fullViewImage && (
          <div
            className='fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50'
            onClick={closeFullView}
          >
            <div className='relative w-full h-full max-w-5xl max-h-5xl p-4'>
              <img
                src={fullViewImage}
                alt='Full view'
                className='absolute inset-0 w-full h-full object-contain'
              />
              <button
                className='absolute top-4 right-4 text-white text-4xl hover:text-red-600 transition-colors md:text-6xl'
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