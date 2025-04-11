import {defineType, defineField} from 'sanity'

// Category-specific schemas
import wineItem from './wineItem'
import coffeeItem from './coffeeItem'
import teaItem from './teaItem'
import softDrinkItem from './softDrinkItem'
import juiceItem from './juiceItem'
import sparklingWaterItem from './sparklingWaterItem'
import spiritItem from './spiritItem'
import signatureCocktailItem from './signatureCocktailItem'
import regularCocktailItem from './regularCocktailItem'
import cocktailTag from './cocktailTag'
import beerItem from './beerItem'

export const schemaTypes = [
  // All category-specific schemas
  wineItem,
  coffeeItem,
  teaItem,
  softDrinkItem,
  juiceItem,
  sparklingWaterItem,
  spiritItem,
  signatureCocktailItem,
  regularCocktailItem,
  cocktailTag,
  beerItem
]