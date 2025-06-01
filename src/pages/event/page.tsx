'use client';
import Image from 'next/image';
import { useState } from 'react';

const sliderImages = ['/party.jpeg', '/party2.jpeg', '/party3.jpeg'];

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
              src="/love.jpg"
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
            { icon: '🏠', label: 'House Party' },
            { icon: '🏀', label: 'Pool Party' },
            { icon: '🎤', label: 'Seminar' },
            { icon: '🎂', label: 'Birthday Party' },
            { icon: '🍸', label: 'Club Party' },
            { icon: '🏖', label: 'Beach Party' },
            { icon: '🎧', label: 'Concert' },
          ].map(({ icon, label }, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 bg-white shadow rounded-md">
              <span className="text-3xl mb-2">{icon}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Events */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6">Trending Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {[
            { title: 'Heartbeat & Rhythm Love Fest', image: '/love.jpg' },
            { title: 'Lasu Food Festival', image: '/love.jpg' },
            { title: 'Lasu Food Festival', image: '/lasusu-food-fest.jpg' },
          ].map(({ title, image }, idx) => (
            <div key={idx} className="w-full max-w-xs">
              <Image
                src={image}
                alt={title}
                width={300}
                height={200}
                className="rounded-lg shadow-md"
              />
              <p className="mt-2 font-semibold">{title}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
