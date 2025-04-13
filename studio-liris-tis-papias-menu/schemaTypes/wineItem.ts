import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'wineItem',
  title: 'Wine Items',
  type: 'document',
  preview: {
    select: {
      titleEn: 'title.en',
      titleGr: 'title.gr',
      subCategory: 'subCategory'
    },
    prepare(selection) {
      const {titleEn, titleGr, subCategory} = selection
      return {
        title: `${titleEn} / ${titleGr}`,
        subtitle: subCategory
      }
    }
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'gr',
          title: 'Greek',
          type: 'string',
          validation: (Rule) => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text'
        },
        {
          name: 'gr',
          title: 'Greek',
          type: 'text'
        }
      ]
    }),
    defineField({
      name: 'grapeVarieties',
      title: 'Grape Varieties',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'gr',
          title: 'Greek',
          type: 'text',
          validation: (Rule) => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'subCategory',
      title: 'Wine Type',
      type: 'string',
      options: {
        list: [
          {title: 'Red Wine', value: 'red-wine'},
          {title: 'White Wine', value: 'white-wine'},
          {title: 'Rosé Wine', value: 'rose-wine'},
          {title: 'Sparkling Wine', value: 'sparkling-wine'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'glassPrice',
      title: 'Glass Price (Optional)',
      type: 'number',
      validation: (Rule) => Rule.precision(2)
    }),
    defineField({
      name: 'bottlePrice',
      title: 'Bottle Price',
      type: 'number',
      validation: (Rule) => Rule.required().precision(2)
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      hidden: true
    })
  ]
}) 