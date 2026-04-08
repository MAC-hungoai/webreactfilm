import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

const movies = [
  {
    code: 'tuyen-thu-de',
    title: 'Tuyển Thủ Dê',
    slug: 'tuyen-thu-de',
    description: 'Bộ phim hài thể thao kể về hành trình của một đội bóng đá nghiệp dư với giấc mơ vươn tới đỉnh cao.',
    studio: 'Galaxy Studio',
    director: 'Lê Thanh Sơn',
    cast: ['Trấn Thành', 'Anh Tú', 'Khả Như'],
    categories: ['Hài', 'Thể thao'],
    status: 'published',
    ageRating: 'T13',
    releaseDate: new Date('2024-04-26'),
    duration: 120,
    language: ['Tiếng Việt'],
    subtitles: ['Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder1.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['phim-viet', 'hai', 'hot-2024'],
  },
  {
    code: 'quat-mo-trung-ma',
    title: 'Quật Mộ Trùng Ma',
    slug: 'quat-mo-trung-ma',
    description: 'Phim kinh dị Hàn Quốc về nhóm pháp sư phải đối mặt với thế lực siêu nhiên khi khai quật ngôi mộ cổ.',
    studio: 'Showbox',
    director: 'Jang Jae-hyun',
    cast: ['Choi Min-sik', 'Kim Go-eun', 'Yoo Hae-jin'],
    categories: ['Kinh dị', 'Tâm linh'],
    status: 'published',
    ageRating: 'T18',
    releaseDate: new Date('2024-02-22'),
    duration: 134,
    language: ['Tiếng Hàn'],
    subtitles: ['Tiếng Việt', 'Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder2.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['kinh-di', 'han-quoc', 'hot-2024'],
  },
  {
    code: 'lat-mat-7',
    title: 'Lật Mặt 7: Một Điều Ước',
    slug: 'lat-mat-7-mot-dieu-uoc',
    description: 'Phần 7 series Lật Mặt - câu chuyện cảm động về tình cảm gia đình và ước mơ.',
    studio: 'Lý Hải Production',
    director: 'Lý Hải',
    cast: ['Trấn Thành', 'Lý Hải', 'Ốc Thanh Vân'],
    categories: ['Gia đình', 'Tình cảm'],
    status: 'published',
    ageRating: 'P',
    releaseDate: new Date('2024-04-26'),
    duration: 132,
    language: ['Tiếng Việt'],
    subtitles: ['Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder3.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['phim-viet', 'gia-dinh', 'lat-mat'],
  },
  {
    code: 'mai',
    title: 'Mai',
    slug: 'mai',
    description: 'Câu chuyện tình cảm sâu sắc về cô gái massage tên Mai và cuộc gặp gỡ định mệnh.',
    studio: 'Trấn Thành Town',
    director: 'Trấn Thành',
    cast: ['Phương Anh Đào', 'Tuấn Trần', 'Trấn Thành'],
    categories: ['Tình cảm', 'Tâm lý'],
    status: 'published',
    ageRating: 'T16',
    releaseDate: new Date('2024-02-10'),
    duration: 131,
    language: ['Tiếng Việt'],
    subtitles: ['Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder4.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['phim-viet', 'tinh-cam', 'tran-thanh'],
  },
  {
    code: 'deadpool-wolverine',
    title: 'Deadpool & Wolverine',
    slug: 'deadpool-wolverine',
    description: 'Deadpool hợp tác với Wolverine trong cuộc phiêu lưu đa vũ trụ điên rồ nhất MCU.',
    studio: 'Marvel Studios',
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman'],
    categories: ['Hành động', 'Hài'],
    status: 'published',
    ageRating: 'T18',
    releaseDate: new Date('2024-07-26'),
    duration: 127,
    language: ['Tiếng Anh'],
    subtitles: ['Tiếng Việt', 'Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder13.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['marvel', 'hanh-dong', 'hai'],
  },
  {
    code: 'inside-out-2',
    title: 'Inside Out 2',
    slug: 'inside-out-2',
    description: 'Riley bước vào tuổi thiếu niên với những cảm xúc mới: Lo Lắng, Ghen Tị, Chán Nản, Xấu Hổ.',
    studio: 'Pixar',
    director: 'Kelsey Mann',
    cast: ['Amy Poehler', 'Maya Hawke'],
    categories: ['Hoạt hình', 'Gia đình', 'Hài'],
    status: 'published',
    ageRating: 'P',
    releaseDate: new Date('2024-06-14'),
    duration: 96,
    language: ['Tiếng Anh'],
    subtitles: ['Tiếng Việt', 'Tiếng Anh'],
    imageUrl: 'https://image.tmdb.org/t/p/w500/placeholder12.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['hoat-hinh', 'pixar', 'gia-dinh'],
  },
];

router.post('/seed', async (req: Request, res: Response) => {
  try {
    console.log('[seed-api] Starting seed...');
    
    for (const movie of movies) {
      await prisma.movie.upsert({
        where: { slug: movie.slug },
        update: movie,
        create: movie,
      });
    }

    console.log('[seed-api] Seed completed successfully');
    res.json({ 
      success: true, 
      message: `Seeded ${movies.length} movies successfully` 
    });
  } catch (error) {
    console.error('[seed-api] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
