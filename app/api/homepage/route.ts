import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  // Get hero settings
  const { data: heroData } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'hero')
    .single()
  
  // Get featured items (projects + blog posts)
  const { data: featuredData } = await supabaseAdmin
    .from('featured_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  
  // Get testimonials
  const { data: testimonialsData } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  
  // Get achievements
  const { data: achievementsData } = await supabaseAdmin
    .from('achievements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  
  // Get latest blog posts for homepage
  const { data: latestPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)
  
  return NextResponse.json({
    hero: heroData?.value || {},
    featured: featuredData || [],
    testimonials: testimonialsData || [],
    achievements: achievementsData || [],
    latestPosts: latestPosts || [],
  })
}