'use client';
import Image from 'next/image';
import { useState } from 'react';

const sliderImages = ['/assets/dj-deck.svg', '/assets/dj-deck.svg', '/assets/dj-deck.svg'];

export default function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  return (
    <main className="w-full px-4 py-8 space-y-16">
      {/* Slider Section */}
      <section className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg">
        <Image
          src={sliderImages[currentSlide]}
          alt={`Slide ${currentSlide}`}
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
        />
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 rounded-full"
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 rounded-full"
        >
          &#8594;
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                idx === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* New Events Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6">NEW EVENTS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Image
              key={idx}
              src="/assets/love.svg"
              alt={`Event ${idx + 1}`}
              width={200}
              height={300}
              className="rounded-lg shadow-lg"
            />
          ))}
        </div>
      </section>

      {/* Discover by Category */}
<section>
  <h2 className="text-2xl font-bold text-center mb-6">Discover by Category</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
    {[
      { image: '/assets/house.svg', label: 'House Party' },
      { image: '/assets/pool.svg', label: 'Pool Party' },
      { image: '/assets/seminar.svg', label: 'Seminar' },
      { image: '/assets/birthday.svg', label: 'Birthday Party' },
      { image: '/assets/club.svg', label: 'Club Party' },
      { image: '/assets/pool.svg', label: 'Beach Party' },
      { image: '/assets/concert.svg', label: 'Concert' },
    ].map(({ image, label }, idx) => (
      <div key={idx} className="flex flex-col items-center p-4 bg-white shadow rounded-md text-black">
        <Image src={image} alt={label} width={50} height={50} className="mb-2" />
        <p>{label}</p>
      </div>
    ))}
  </div>
</section>

      {/* Trending Events */}
     <section className="bg-black py-16 px-6 lg:px-24">
             <h2 className="text-2xl font-bold text-center mb-10">NEW EVENTS</h2>
             <div className="flex flex-col lg:flex-row gap-10 items-center">
               <div className="max-w-md w-full">
                 <Image
                   src="/assets/lasu-food.svg"
                   alt="Featured Event"
                   width={400}
                   height={300}
                   className="rounded-lg w-full"
                 />
                 <h3 className="text-lg font-semibold mt-4">
                   Heartbeat & Rhythm (Love Fest)
                 </h3>
                 <p className="text-sm text-gray-400">Location & time details here</p>
               </div>
     
               <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                 {new Array(4).fill(0).map((_, i) => (
                   <div key={i} className="text-sm">
                     <Image
                       src="/assets/lasu-food.svg"
                       alt="Small Event"
                       width={120}
                       height={90}
                       className="rounded-lg"
                     />
                     <h4 className="font-semibold mt-2">LASU FOOD FESTIVAL</h4>
                     <p className="text-gray-400">Quick details</p>
                   </div>
                 ))}
               </div>
             </div>
           </section>
           </main>
  );
};