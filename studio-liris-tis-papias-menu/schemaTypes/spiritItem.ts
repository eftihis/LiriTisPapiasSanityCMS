import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'spiritItem',
  title: 'Spirit Items',
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
      name: 'subCategory',
      title: 'Spirit Type',
      type: 'string',
      options: {
        list: [
          {title: 'Vodka', value: 'vodka'},
          {title: 'Gin', value: 'gin'},
          {title: 'Tequila', value: 'tequila'},
          {title: 'Mezcal', value: 'mezcal'},
          {title: 'Rum', value: 'rum'},
          {title: 'Spiced Rum', value: 'spiced rum'},
          {title: 'Irish Whiskey', value: 'irish whiskey'},
          {title: 'Scotch Whiskey', value: 'scotch whiskey'},
          {title: 'Bourbon & Rye', value: 'bourbon & rye'},
          {title: 'Cognac', value: 'cognac'},
          {title: 'Liqueur', value: 'liqueur'},
          {title: 'Bitters', value: 'bitters'},
          {title: 'Greek Spirits', value: 'greek spirits'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'variants',
      title: 'Size Variants',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'size',
            title: 'Size',
            type: 'string',
            validation: (Rule) => Rule.required()
          }),
          defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().precision(2)
          })
        ]
      }],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      hidden: true
    })
  ]
}) 