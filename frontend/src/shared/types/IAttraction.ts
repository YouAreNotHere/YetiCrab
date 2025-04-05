export interface IAttraction {
  id: string;
  name: string;
  description: string;
  addedAt: Date;
  rating: number[];
  photoUrl: string;
  location: string;
  latitude: number;
  longitude: number;
  mapLink: string;
  isVisited: boolean;
}

export interface IUpdatedAttraction
  extends Omit<
    IAttraction,
    'id' | 'addedAt' | 'rating' | 'latitude' | 'longitude'
  > {
  id?: string;
  addedAt?: Date;
  rating?: number[];
  latitude?: number | string;
  longitude?: number | string;
}

export interface IFetchAttraction
    extends Omit<
        IUpdatedAttraction,
        'image'
    > {
  image?: Blob | undefined;
}

