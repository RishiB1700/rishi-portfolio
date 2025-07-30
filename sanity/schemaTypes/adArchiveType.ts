import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const adArchiveType = defineType({
  name: 'adArchive',
  title: 'Ad Archive',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'campaignName',
      title: 'Campaign Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'agency',
      title: 'Agency',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1950).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'TV', value: 'TV'},
          {title: 'Print', value: 'Print'},
          {title: 'OOH', value: 'OOH'},
          {title: 'Digital', value: 'Digital'},
          {title: 'Experimental', value: 'Experimental'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Award-Winning', value: 'Award-Winning'},
          {title: 'Controversial', value: 'Controversial'},
          {title: 'Viral', value: 'Viral'},
          {title: 'Banned', value: 'Banned'},
          {title: 'Iconic', value: 'Iconic'},
        ],
      },
    }),
    defineField({
      name: 'visual',
      title: 'Visual',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'personalInsight',
      title: 'Personal Insight',
      type: 'text',
      description: 'Short insight that appears on cards',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'fullInsight',
      title: 'Full Insight',
      type: 'text',
      description: 'Detailed analysis for the modal view',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional YouTube or Vimeo URL',
    }),
    defineField({
      name: 'size',
      title: 'Card Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'campaignName',
      brand: 'brand',
      year: 'year',
      media: 'visual',
      mediaType: 'mediaType',
    },
    prepare(selection) {
      const {title, brand, year, mediaType} = selection
      return {
        title: `${title} (${brand})`,
        subtitle: `${year} • ${mediaType?.toUpperCase()}`,
        media: selection.media,
      }
    },
  },
})
