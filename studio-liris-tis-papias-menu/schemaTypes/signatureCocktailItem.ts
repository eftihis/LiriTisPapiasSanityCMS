import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'signatureCocktailItem',
  title: 'Signature Cocktail Items',
  type: 'document',
  preview: {
    select: {
      titleEn: 'title.en',
      titleGr: 'title.gr'
    },
    prepare(selection) {
      const {titleEn, titleGr} = selection
      return {
        title: `${titleEn} / ${titleGr}`,
        subtitle: 'Signature Cocktail'
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
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().precision(2)
    }),
    defineField({
      name: 'cocktailTags',
      title: 'Cocktail Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'cocktailTag' }] }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      hidden: true
    })
  ]
}) 