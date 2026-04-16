import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      const movie = await prisma.movie.findUnique({
        where: { id: String(id) },
      })
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' })
      }
      res.status(200).json(movie)
    } else if (req.method === 'PUT') {
      const { title, description, videoUrl, imageUrl, categories, slug } = req.body

      const movie = await prisma.movie.update({
        where: { id: String(id) },
        data: {
          title,
          description,
          videoUrl,
          imageUrl,
          categories,
          slug,
        },
      })
      res.status(200).json(movie)
    } else if (req.method === 'DELETE') {
      await prisma.movie.delete({
        where: { id: String(id) },
      })
      res.status(200).json({ message: 'Movie deleted successfully' })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in /api/movies/[id]:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined
    })
  }
}
