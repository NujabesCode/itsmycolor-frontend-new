import { BodyType } from '../user/type';

export enum ColorSeason {
  SPRING_BRIGHT = 'Spring Bright',
  SPRING_LIGHT = 'Spring Light',
  SUMMER_LIGHT = 'Summer Light',
  SUMMER_MUTE = 'Summer Mute',
  AUTUMN_MUTE = 'Autumn Mute',
  AUTUMN_DEEP = 'Autumn Deep',
  WINTER_DARK = 'Winter Dark',
  WINTER_BRIGHT = 'Winter Bright',
}

export interface ColorAnalysis {
  id: string;
  height: number;
  weight: number;
  bodyType: BodyType | null;
  colorSeason: ColorSeason | null;
  preferredStyle: string | null;
  createdAt: string;
  updatedAt: string;
}
