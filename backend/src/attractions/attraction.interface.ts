export interface Attraction {
  id: string;
  name: string;
  description: string;
  addedAt: Date;
  rating: number;
  photoUrl: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  mapLink: string;
  isVisites: boolean;
}
