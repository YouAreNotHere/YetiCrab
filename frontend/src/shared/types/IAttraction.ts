export interface IAttraction {
  id: string;
  name: string;
  description: string;
  addedAt: Date;
  rating: number;
  photoUrl: string;
  location: string;
  latitude: number;
  longitude: number;
  mapLink: string;
  isVisites: boolean;
}
