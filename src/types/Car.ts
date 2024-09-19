export interface Car {
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
    engineType?: string;
    wltpCO2Emissions?: {
      en: string;
      de: string;
    };
    wltpCO2Class?: {
      en: string;
      de: string;
    };
    wltpFuelConsumption?: {
      en: string;
      de: string;
    };
}
  
export interface CarImage {
    url: string;
    environment: string;
    viewAngle: string;
}
  
export interface CarColor {
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