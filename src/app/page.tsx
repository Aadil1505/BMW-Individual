'use client'

import { FamilyButtonDemo } from '@/components/FamilyButton';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Car, CarColor, CarImage } from '@/types/Car';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export default function PremiumBMWGallery() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [selectedColor, setSelectedColor] = useState<CarColor | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("https://api.visualizer.aws.bmw.cloud/v1/cars");
        if (!res.ok) throw new Error('Failed to fetch cars');
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const fetchCarMedia = useCallback(async (car: Car, color: CarColor) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.visualizer.aws.bmw.cloud/v1/cars/${car.modelRange}/${car.typeCode}/${color.p0ID}/media`);
      if (!res.ok) throw new Error('Failed to fetch car media');
      const data = await res.json();
      setCarImages(data.images);
      setActiveImageIndex(0);
    } catch (error) {
      console.error("Error fetching car media:", error);
      setError('Failed to load car images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCarSelect = useCallback((car: Car) => {
    setSelectedCar(car);
    setSelectedColor(null);
    setCarImages([]);
  }, []);

  const handleColorSelect = useCallback((color: CarColor) => {
    setSelectedColor(color);
    if (selectedCar) {
      fetchCarMedia(selectedCar, color);
    }
  }, [selectedCar, fetchCarMedia]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      setActiveImageIndex((prevIndex) => 
        (prevIndex - 1 + carImages.length) % carImages.length
      );
    } else if (event.key === 'ArrowRight') {
      setActiveImageIndex((prevIndex) => 
        (prevIndex + 1) % carImages.length
      );
    }
  }, [carImages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const activeImage = carImages[activeImageIndex];

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  const isLastFourImages = activeImageIndex >= carImages.length - 4;

  return (
    <motion.div
      className="w-full h-screen overflow-hidden relative"
      animate={{ backgroundColor: selectedColor ? selectedColor.hexCode : '#000000' }}
      // transition={{ duration: 0.5 }}
    >
      {activeImage ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // transition={{ duration: .4 }}
            className="w-full h-full relative"
          >
            <Image
              src={activeImage.url}
              alt={`${selectedCar?.localizedName.en || 'BMW'} - ${activeImage.environment} - ${activeImage.viewAngle}`}
              fill
              className="object-cover max-sm:opacity-70"
              priority
              quality={100}
            />
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" /> */}

            <div className='sm:hidden absolute inset-0 flex flex-col justify-center items-center p-4'>
              <Carousel className="w-full max-w-sm mb-2">
                <CarouselContent>
                  {carImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <Image
                          src={image.url}
                          alt={`${selectedCar?.localizedName.en || 'BMW'} - ${image.environment} - ${image.viewAngle}`}
                          fill
                          className="object-cover"
                          priority
                          quality={100}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
              {/* <div>
                <h3>{selectedCar?.localizedName.en}</h3>
                <h3>{selectedCar?.wltpCO2Emissions?.en}</h3>
                <h3>{selectedCar?.wltpFuelConsumption?.en}</h3>
                <h3>{selectedCar?.series} {selectedCar?.modelRange} {selectedCar?.typeCode}</h3>
              </div> */}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center">
          <p className="text-primary-foreground text-2xl">
            {isLoading ? <Loader className='animate-spin size-10'/> : selectedCar ? 'Select a color to view images' : 'Select a car and color to view images'}
          </p>
        </div>
      )}


      <FamilyButtonDemo
        cars={cars}
        onCarSelect={handleCarSelect}
        onColorSelect={handleColorSelect}
      />

      {selectedCar && (
        <div className={`absolute top-8 left-8 ${isLastFourImages ? 'text-primary' : 'text-secondary'}`}>
          <h1 className="md:text-4xl text-2xl font-bold">{selectedCar.localizedName.en}</h1>
          {selectedColor && (
            <div className="md:text-xl text-md mt-2">
              <p>{selectedColor.localizedName?.en}</p>
              <p>{selectedCar?.wltpCO2Emissions?.en}</p>
              <p>{selectedCar?.wltpFuelConsumption?.en}</p>
              <p>{selectedCar?.modelRange} {selectedCar?.typeCode}</p>
            </div>
          )}
        </div>
      )}

      {activeImage && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-8 right-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <Maximize2 className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full h-[80vh] border-none">
            <Image
              src={activeImage.url}
              alt={`${selectedCar?.localizedName.en || 'BMW'} - ${activeImage.environment} - ${activeImage.viewAngle}`}
              fill
              className="object-contain"
              quality={100}
            />
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}