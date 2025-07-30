import { client } from '@/sanity/lib/client'

// Blog post queries
export async function getAllPosts() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      tags,
      mood,
      hook,
      "mainImage": mainImage.asset->url,
      "categories": categories[]->title,
      body,
      readTime,
      "author": author->name
    }`
  )
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      tags,
      mood,
      hook,
      "mainImage": mainImage.asset->url,
      "categories": categories[]->title,
      body,
      readTime,
      "author": author->name
    }`,
    { slug }
  )
}

export async function getPostsByCategory(category: string) {
  return client.fetch(
    `*[_type == "post" && $category in categories[]->title] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      tags,
      mood,
      hook,
      "mainImage": mainImage.asset->url,
      "categories": categories[]->title,
      body,
      readTime,
      "author": author->name
    }`,
    { category }
  )
}

// Ad Archive queries
export async function getAllCampaigns() {
  return client.fetch(
    `*[_type == "adArchive"] | order(year desc) {
      _id,
      campaignName,
      brand,
      agency,
      year,
      mediaType,
      badges,
      "visual": visual.asset->url,
      personalInsight,
      fullInsight,
      tags,
      videoUrl,
      size
    }`
  )
}

export async function getCampaignsByMediaType(mediaType: string) {
  return client.fetch(
    `*[_type == "adArchive" && mediaType == $mediaType] | order(year desc) {
      _id,
      campaignName,
      brand,
      agency,
      year,
      mediaType,
      badges,
      "visual": visual.asset->url,
      personalInsight,
      fullInsight,
      tags,
      videoUrl,
      size
    }`,
    { mediaType }
  )
}

export async function getCampaignsByBadge(badge: string) {
  return client.fetch(
    `*[_type == "adArchive" && $badge in badges] | order(year desc) {
      _id,
      campaignName,
      brand,
      agency,
      year,
      mediaType,
      badges,
      "visual": visual.asset->url,
      personalInsight,
      fullInsight,
      tags,
      videoUrl,
      size
    }`,
    { badge }
  )
}