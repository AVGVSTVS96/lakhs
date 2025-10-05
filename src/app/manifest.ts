import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lakhs & Crores Converter',
    short_name: 'Lakhs',
    description: 'Convert Indian numbers (lakhs, crores) to USD/INR with live exchange rates',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
  }
}
