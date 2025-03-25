export class CreateAttractionDto {
  name: string;
  description: string;
  rating: number;
  photoUrl: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
