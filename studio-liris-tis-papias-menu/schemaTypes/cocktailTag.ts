import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'cocktailTag',
  title: 'Cocktail Tags',
  type: 'document',
  preview: {
    select: {
      nameEn: 'name.en',
      nameGr: 'name.gr'
    },
    prepare(selection) {
      const {nameEn, nameGr} = selection
      return {
        title: `${nameEn || ''} / ${nameGr || ''}`,
        subtitle: 'Cocktail Tag'
      }
    }
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
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
    })
  ],
}) 