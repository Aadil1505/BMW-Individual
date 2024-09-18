"use client"

import { useMemo, useState, useEffect } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import useMeasure from "react-use-measure"
import { Car, Palette } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import FamilyButton from "./cult/family-button"

// Update the Car interface to match the one in page.tsx
interface Car {
  modelRange: string;
  typeCode: string;
  localizedName: {
    en: string;
    de: string;
    it: string;
    fr: string;
    es: string;
  };
  series: string;
  // ... other properties ...
}

// Update the CarColor interface to match the one in page.tsx
interface CarColor {
  p0ID: string;
  hexCode: string;
  mainColor: string;
  effect: string;
  localizedName: {
    en: string;
    de: string;
    fr: string;
    zh: string;
  };
  SortIndex: number;
}

interface CarColorPickerProps {
  cars: Car[];
  onCarSelect: (car: Car) => void;
  onColorSelect: (color: CarColor) => void;
}

let tabs = [
  { id: 0, label: "Car", icon: Car },
  { id: 1, label: "Color", icon: Palette },
]

export function CarColorPicker({ cars, onCarSelect, onColorSelect }: CarColorPickerProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, bounds] = useMeasure()
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [carColors, setCarColors] = useState<CarColor[]>([])

  useEffect(() => {
    if (selectedCar) {
      // Fetch colors for the selected car
      fetch(`https://api.visualizer.aws.bmw.cloud/v1/cars/${selectedCar.modelRange}/${selectedCar.typeCode}/colors`)
        .then(res => res.json())
        .then(data => {
          setCarColors(data.sort((a: CarColor, b: CarColor) => a.SortIndex - b.SortIndex))
        })
        .catch(error => {
          console.error("Error fetching car colors:", error)
        })
    }
  }, [selectedCar])

  const content = useMemo(() => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollArea className="h-[180px] w-full">
            {cars.map((car) => (
              <div
                key={car.modelRange}
                className="p-2 hover:bg-neutral-800 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  setSelectedCar(car)
                  onCarSelect(car)
                  setActiveTab(1)
                }}
              >
                {car.localizedName.en}
              </div>
            ))}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )
      case 1:
        return (
          <ScrollArea className="h-[180px] w-full">
            <div className="grid grid-cols-4 gap-2 p-2">
              {carColors.map((color) => (
                <TooltipProvider key={color.p0ID}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-white`}
                        style={{ backgroundColor: color.hexCode }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onColorSelect(color)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color.localizedName.en}</p>
                      <p>{color.effect} {color.mainColor}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )
      default:
        return null
    }
  }, [activeTab, cars, carColors, onCarSelect, onColorSelect])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(newTabId)
    }
  }

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  return (
    <div className="flex flex-col items-center pt-4 w-full">
      <div className="flex space-x-1 border border-none rounded-[8px] cursor-pointer bg-neutral-700 px-[3px] py-[3.2px] shadow-inner-shadow">
        {tabs.map((tab, i) => (
          <button
            key={`${tab.id}-i-${i}`}
            onClick={() => handleTabClick(tab.id)}
            className={`${
              activeTab === tab.id ? "text-white " : "hover:text-neutral-300/60"
            } relative rounded-[5px] px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-600  transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:ring-blue-light focus-visible:outline-none`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="family-bubble"
                className="absolute inset-0 z-10 bg-neutral-800  mix-blend-difference shadow-inner-shadow"
                style={{ borderRadius: 5 }}
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}
            <tab.icon className="w-4 h-4 inline-block mr-1" />
            {tab.label}
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto my-[10px] w-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height > 180 ? 180 : bounds.height }}
        >
          <div className="w-full" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                className="w-full"
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}

export function FamilyButtonDemo({ cars, onCarSelect, onColorSelect }: CarColorPickerProps) {
  return (
    <div className="w-full h-full min-h-[240px]">
      <div className="absolute bottom-4 right-4">
        <FamilyButton>
          <CarColorPicker cars={cars} onCarSelect={onCarSelect} onColorSelect={onColorSelect} />
        </FamilyButton>
      </div>
    </div>
  )
}