const { AppDataSource } = require('../../ormconfig.cjs'); 
import { Attraction } from './attraction.entity';

export const seedAttractions = async () => {
  const attractionRepository = AppDataSource.getRepository(Attraction);

  const existingAttractions = await attractionRepository.find();
  if (existingAttractions.length > 0) {
    console.log('Seed data already exists. Skipping seeding.');
    return;
  }

  const attractions = [
    {
      name: 'Эйфелева башня',
      description: 'Самая узнаваемая достопримечательность Парижа.',
      rating: [3, 2, 2],
      photoUrl: 'https://7d9e88a8-f178-4098-bea5-48d960920605.selcdn.net/f02bf9e6-3603-4476-afa6-4b5dcd94cb7b/-/format/webp/-/resize/1300x/',
      location: 'Париж, Франция',
      latitude: 48.8584,
      longitude: 2.2945,
      mapLink: 'https://www.google.com/maps?q=48.8584,2.2945',
      isVisited: false,
    },
    {
      name: 'Колизей',
      description: 'Античный амфитеатр в Риме.',
      rating: [4, 4, 5],
      photoUrl: 'https://storage.yandexcloud.net/roz-wiki/thumb/Colosseo_2020_cropped.jpg/274px-Colosseo_2020_cropped.jpg',
      location: 'Рим, Италия',
      latitude: 41.8902,
      longitude: 12.4924,
      mapLink: 'https://www.google.com/maps?q=41.8902,12.4924',
      isVisited: false,
    },
    {
      name: 'Великая Китайская стена',
      description: 'Крупнейший памятник архитектуры человечества.',
      rating: [4, 3, 5],
      photoUrl: 'https://fs.tonkosti.ru/22/y9/22y9206ruxus48ssw0cwckswo.jpg',
      location: 'Китай',
      latitude: 40.4319,
      longitude: 116.5704,
      mapLink: 'https://www.google.com/maps?q=40.4319,116.5704',
      isVisited: false,
    },
    {
      name: 'Тадж-Махал',
      description: 'Мавзолей-мечеть из белого мрамора в Индии.',
      rating: [5, 5, 1],
      photoUrl: 'https://cdn.radiosputnik.ru/images/152923/47/1529234700_344:0:1624:1280_1280x0_80_0_0_c739abf1f4df1e8b59058797b7343769.jpg',
      location: 'Агра, Индия',
      latitude: 27.1751,
      longitude: 78.0421,
      mapLink: 'https://www.google.com/maps?q=27.1751,78.0421',
      isVisited: false,
    },
    {
      name: 'Сфинкс и пирамиды Гизы',
      description: 'Древние египетские памятники.',
      rating: [2, 3, 4],
      photoUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/7e/7d/2c/pyramids-of-giza.jpg?w=1200&h=1200&s=1',
      location: 'Гиза, Египет',
      latitude: 29.9753,
      longitude: 31.1376,
      mapLink: 'https://www.google.com/maps?q=29.9753,31.1376',
      isVisited: false,
    },
    {
      name: 'Мачу-Пикчу',
      description: 'Город инков в перуанских Андах.',
      rating: [1, 3, 5],
      photoUrl: 'https://a.travelcdn.mts.ru/travel-media/machu_pikchu_1_8085d27237.jpg',
      location: 'Перу',
      latitude: -13.1631,
      longitude: -72.5450,
      mapLink: 'https://www.google.com/maps?q=-13.1631,-72.5450',
      isVisited: false,
    },
    {
      name: 'Сиднейский оперный театр',
      description: 'Архитектурный символ Австралии.',
      rating: [1, 2, 3],
      photoUrl: 'https://australiantravelclub.ru/wp-content/uploads/2023/01/sydney-opera-house.jpg',
      location: 'Сидней, Австралия',
      latitude: -33.8568,
      longitude: 151.2153,
      mapLink: 'https://www.google.com/maps?q=-33.8568,151.2153',
      isVisited: false,
    },
    {
      name: 'Старый город Дубая',
      description: 'Традиционные арабские постройки и рынки.',
      rating: [1, 1, 2],
      photoUrl: 'https://www.flagman.travel/upload/medialibrary/9d1/9d183389042527952c9563fa09df029b.jpg',
      location: 'Дубай, ОАЭ',
      latitude: 25.2631,
      longitude: 55.2972,
      mapLink: 'https://www.google.com/maps?q=25.2631,55.2972',
      isVisited: false,
    },
    {
      name: 'Московский Кремль',
      description: 'Исторический комплекс в центре Москвы.',
      rating: [2, 4, 5],
      photoUrl: 'https://architectureguru.ru/wp-content/uploads/2019/11/moscow-kremlin-1.jpg',
      location: 'Москва, Россия',
      latitude: 55.7520,
      longitude: 37.6175,
      mapLink: 'https://www.google.com/maps?q=55.7520,37.6175',
      isVisited: false,
    },
    {
      name: 'Замок Нойшванштайн',
      description: 'Сказочный замок в Баварских Альпах.',
      rating: [4, 5, 5],
      photoUrl: 'https://www.kids-in-trips.ru/wp-content/uploads/2013/01/Neuschwanstein-10.jpg',
      location: 'Бавария, Германия',
      latitude: 47.5576,
      longitude: 10.7498,
      mapLink: 'https://www.google.com/maps?q=47.5576,10.7498',
      isVisited: false,
    },
  ];

  for (const attractionData of attractions) {
    const existingAttraction = await attractionRepository.findOne({
      where: { name: attractionData.name },
    });

    if (!existingAttraction) {
      const attraction = attractionRepository.create(attractionData);
      await attractionRepository.save(attraction);
    }
  }
};