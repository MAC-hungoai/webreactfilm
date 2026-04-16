import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const movies = await prisma.movie.findMany()
      res.status(200).json(movies)
    } else if (req.method === 'POST') {
      const { title, description, videoUrl, imageUrl, code, slug, categories } = req.body

      const movie = await prisma.movie.create({
        data: {
          title,
          description,
          videoUrl,
          imageUrl,
          code: code || `movie_${Date.now()}`,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
          categories: categories || [],
        },
      })
      res.status(201).json(movie)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in /api/movies:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined
    })
  }
}
