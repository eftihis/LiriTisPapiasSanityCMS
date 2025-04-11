import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'regularCocktailItem',
  title: 'Regular Cocktail Items',
  type: 'document',
  preview: {
    select: {
      titleEn: 'title.en',
      titleGr: 'title.gr',
      category: 'category'
    },
    prepare(selection) {
      const {titleEn, titleGr, category} = selection
      return {
        title: `${titleEn} / ${titleGr}`,
        subtitle: category
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Classic Cocktails', value: 'classic'},
          {title: 'Spritz', value: 'spritz'},
          {title: 'Mocktails', value: 'mocktails'},
          {title: 'Margaritas', value: 'margaritas'},
          {title: 'Mojitos', value: 'mojitos'},
          {title: 'Other', value: 'other'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
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
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      hidden: true
    })
  ]
}) 