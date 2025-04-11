import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'beerItem',
  title: 'Beer Items',
  type: 'document',
  preview: {
    select: {
      titleEn: 'title.en',
      titleGr: 'title.gr',
      beerType: 'beerType'
    },
    prepare(selection) {
      const {titleEn, titleGr, beerType} = selection
      return {
        title: `${titleEn} / ${titleGr}`,
        subtitle: beerType
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
      name: 'beerType',
      title: 'Beer Type',
      type: 'string',
      options: {
        list: [
          {title: 'Local', value: 'local'},
          {title: 'Imported', value: 'imported'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description (Optional)',
      type: 'object',
      description: 'Optional description for the beer',
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
      name: 'size',
      title: 'Size (ml)',
      type: 'number',
      validation: (Rule) => Rule.required().positive().integer()
    }),
    defineField({
      name: 'price',
      title: 'Price',
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