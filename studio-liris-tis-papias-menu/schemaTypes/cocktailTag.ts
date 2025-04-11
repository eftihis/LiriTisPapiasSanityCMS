import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'cocktailTag',
  title: 'Cocktail Tags',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    })
  ],
}) 