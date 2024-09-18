"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const images = [
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_MTown_day_cam_01.jpg",
      environment: "MTown",
      viewAngle: "34front"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_MTown_day_cam_02.jpg",
      environment: "MTown",
      viewAngle: "34back"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_MTown_day_cam_03.jpg",
      environment: "MTown",
      viewAngle: "front"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_MTown_day_cam_04.jpg",
      environment: "MTown",
      viewAngle: "side"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_Studio_day_cam_01.jpg",
      environment: "Studio",
      viewAngle: "34front"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_Studio_day_cam_02.jpg",
      environment: "Studio",
      viewAngle: "34back"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_Studio_day_cam_03.jpg",
      environment: "Studio",
      viewAngle: "front"
    },
    {
      url: "https://renderings.evecp.bmw.cloud/trunks/2946b95dde528117736d6b7ec62accbcf17e694e1ca0e695ea0bad94/G82_de_Studio_day_cam_04.jpg",
      environment: "Studio",
      viewAngle: "side"
    }
  ]

const colorOptions = [
  { name: 'White', rgb: '255,255,255' },
  { name: 'Light Gray', rgb: '220,220,220' },
  { name: 'Dark Gray', rgb: '64,64,64' },
  { name: 'Black', rgb: '0,0,0' },
  { name: 'Red', rgb: '255,0,0' },
  { name: 'Blue', rgb: '0,0,255' },
  { name: 'Green', rgb: '0,255,0' },
  { name: 'Yellow', rgb: '255,255,0' },
  { name: 'Purple', rgb: '128,0,128' },
  { name: 'Orange', rgb: '255,165,0' },
  { name: 'Pink', rgb: '255,192,203' },
  { name: 'Teal', rgb: '0,128,128' },
];

const ColorPicker = ({ backgroundColor, setBackgroundColor }) => {
  return (
    <ScrollArea className="w-28 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {colorOptions.map((color) => (
          <button
            key={color.rgb}
            className={`w-10 h-10 rounded-full flex-shrink-0 focus:outline-none ${
              backgroundColor === color.rgb ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: `rgb(${color.rgb})` }}
            onClick={() => setBackgroundColor(color.rgb)}
            title={color.name}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const PremiumBMWGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEnvironment, setSelectedEnvironment] = useState('All');
  const [backgroundColor, setBackgroundColor] = useState('255,255,255');

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: `rgb(${backgroundColor})` }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">BMW M4 Gallery</h1>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="relative aspect-video mb-4">
              <Image
                src={currentImage.url}
                alt={`BMW M4 - ${currentImage.environment} - ${currentImage.viewAngle}`}
                fill
                className="rounded-lg object-cover"
              />
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImage.environment} - {currentImage.viewAngle}
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                {['All', 'MTown', 'Studio'].map((env) => (
                  <button
                    key={env}
                    className={`px-4 py-2 rounded ${selectedEnvironment === env ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedEnvironment(env)}
                  >
                    {env}
                  </button>
                ))}
              </div>
              <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={image.url}
                className={`relative aspect-video cursor-pointer overflow-hidden rounded-md ${
                  index === currentIndex ? 'ring-2 ring-blue-500' : 'opacity-70'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={`BMW M4 - ${image.environment} - ${image.viewAngle}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBMWGallery;