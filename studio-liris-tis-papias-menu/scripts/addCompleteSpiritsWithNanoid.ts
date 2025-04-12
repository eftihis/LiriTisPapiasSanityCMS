import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import { nanoid } from 'nanoid'

// Load environment variables
dotenv.config()

// Initialize the client
const client = createClient({
  projectId: 'ivfy9y3f',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_TOKEN
})

type SpiritItem = {
  _type: string
  _key?: string
  _id?: string
  title: {
    en: string
    gr: string
  }
  description?: {
    en?: string
    gr?: string
  }
  subCategory: string
  variants: {
    size: string,
    price: number,
    _key?: string
  }[]
  orderRank: number
}

// Helper function to generate a slug-like key from title
function generateKey(subCategory: string, title: string): string {
  // Remove special characters, replace spaces with hyphens, convert to lowercase
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')  // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .trim();
  
  return `${subCategory}-${cleanTitle}`;
}

// Helper function to generate a Sanity-compatible key
function generateSanityKey(): string {
  return nanoid(12) // Standard length for Sanity keys
}

// Define all spirit items without keys first
const rawSpiritItems = [
  // VODKA
  {
    title: {
      en: '42 Below',
      gr: '42 Below'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 10
  },
  {
    title: {
      en: 'Absolut',
      gr: 'Absolut'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 20
  },
  {
    title: {
      en: 'Absolut Citron',
      gr: 'Absolut Citron'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 30
  },
  {
    title: {
      en: 'Beluga',
      gr: 'Beluga'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 40
  },
  {
    title: {
      en: 'Belvedere',
      gr: 'Belvedere'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 50
  },
  {
    title: {
      en: 'Crystal Head',
      gr: 'Crystal Head'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 60
  },
  {
    title: {
      en: 'Grey Goose',
      gr: 'Grey Goose'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 70
  },
  {
    title: {
      en: 'Ketel',
      gr: 'Ketel'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 80
  },
  {
    title: {
      en: 'Nemiroff Deluxe',
      gr: 'Nemiroff Deluxe'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 90
  },
  {
    title: {
      en: 'Regular X',
      gr: 'Regular X'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 100
  },
  {
    title: {
      en: 'Regular X Premium',
      gr: 'Regular X Premium'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 110
  },
  {
    title: {
      en: 'Stolichnaya',
      gr: 'Stolichnaya'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 120
  },
  {
    title: {
      en: 'Zumbrowka',
      gr: 'Zumbrowka'
    },
    subCategory: 'vodka',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 130
  },
  
  // GIN
  {
    title: {
      en: 'Bathtub',
      gr: 'Bathtub'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 200
  },
  {
    title: {
      en: 'Beefeater 24',
      gr: 'Beefeater 24'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 210
  },
  {
    title: {
      en: 'Boatyard',
      gr: 'Boatyard'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 220
  },
  {
    title: {
      en: 'Boatyard Old Tom',
      gr: 'Boatyard Old Tom'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 230
  },
  {
    title: {
      en: "Bobby's",
      gr: "Bobby's"
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 240
  },
  {
    title: {
      en: 'Bombay Saphire',
      gr: 'Bombay Saphire'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 250
  },
  {
    title: {
      en: "Broker's",
      gr: "Broker's"
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 260
  },
  {
    title: {
      en: 'Bulldog',
      gr: 'Bulldog'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 270
  },
  {
    title: {
      en: 'Citadelle Original Dry',
      gr: 'Citadelle Original Dry'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 280
  },
  {
    title: {
      en: 'Del Profesore',
      gr: 'Del Profesore'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 290
  },
  // Continue with more gin items...
  
  // TEQUILA
  {
    title: {
      en: 'Altos Plata',
      gr: 'Altos Plata'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 400
  },
  {
    title: {
      en: 'Calle 23 Blanco',
      gr: 'Calle 23 Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 410
  },
  {
    title: {
      en: 'Calle 23 Reposado',
      gr: 'Calle 23 Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 20.00 }
    ],
    orderRank: 420
  },
  {
    title: {
      en: 'Casarodes Blanco',
      gr: 'Casarodes Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 430
  },
  {
    title: {
      en: 'Casarodes Reposado',
      gr: 'Casarodes Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 440
  },
  {
    title: {
      en: 'Ocho Blanco',
      gr: 'Ocho Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 450
  },
  {
    title: {
      en: 'Ocho Reposado',
      gr: 'Ocho Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 460
  },
  // Continue with more tequila items...

  // Continue with more gin items...
  {
    title: {
      en: 'Elephant',
      gr: 'Elephant'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 300
  },
  {
    title: {
      en: 'Etsu Handcrafted',
      gr: 'Etsu Handcrafted'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 310
  },
  {
    title: {
      en: 'Filliers',
      gr: 'Filliers'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 320
  },
  {
    title: {
      en: 'Gabriel Boudier Saffron',
      gr: 'Gabriel Boudier Saffron'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 330
  },
  {
    title: {
      en: 'Gin Mare',
      gr: 'Gin Mare'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 340
  },
  {
    title: {
      en: 'Gin Raw',
      gr: 'Gin Raw'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 350
  },
  {
    title: {
      en: 'Grace',
      gr: 'Grace'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 360
  },
  {
    title: {
      en: "Hendrick's",
      gr: "Hendrick's"
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 370
  },
  {
    title: {
      en: 'Himbrimi',
      gr: 'Himbrimi'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 15.00 }
    ],
    orderRank: 380
  },
  {
    title: {
      en: 'Ki No Bi',
      gr: 'Ki No Bi'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 15.00 }
    ],
    orderRank: 390
  },
  {
    title: {
      en: "Martin Miller's",
      gr: "Martin Miller's"
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 391
  },
  {
    title: {
      en: 'Mataroa',
      gr: 'Mataroa'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 392
  },
  {
    title: {
      en: 'Mataroa Pink',
      gr: 'Mataroa Pink'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 393
  },
  {
    title: {
      en: 'Monkey 47',
      gr: 'Monkey 47'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 394
  },
  {
    title: {
      en: 'Nikka Coffey',
      gr: 'Nikka Coffey'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 395
  },
  {
    title: {
      en: 'Nuage',
      gr: 'Nuage'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 396
  },
  {
    title: {
      en: 'Roku',
      gr: 'Roku'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 397
  },
  {
    title: {
      en: 'Oxley',
      gr: 'Oxley'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 398
  },
  {
    title: {
      en: 'Tanqueray',
      gr: 'Tanqueray'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 399
  },
  {
    title: {
      en: 'Tanqueray No10',
      gr: 'Tanqueray No10'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 399.1
  },
  {
    title: {
      en: 'The Botanist',
      gr: 'The Botanist'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 399.2
  },
  {
    title: {
      en: 'Votanikon',
      gr: 'Votanikon'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 399.3
  },
  {
    title: {
      en: 'Walcher',
      gr: 'Walcher'
    },
    subCategory: 'gin',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 399.4
  },
  
  // TEQUILA
  {
    title: {
      en: 'Ocho Reposado',
      gr: 'Ocho Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 460
  },
  {
    title: {
      en: 'Patron Blanco',
      gr: 'Patron Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 470
  },
  {
    title: {
      en: 'Patron Reposado',
      gr: 'Patron Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 480
  },
  {
    title: {
      en: 'Topanito Blanco',
      gr: 'Topanito Blanco'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 490
  },
  {
    title: {
      en: 'Topanito Reposado',
      gr: 'Topanito Reposado'
    },
    subCategory: 'tequila',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 500
  },
  
  // MEZCAL
  {
    title: {
      en: 'Mezcal Amores',
      gr: 'Mezcal Amores'
    },
    subCategory: 'mezcal',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 600
  },
  {
    title: {
      en: 'Bruxo Elixir Des Los Terrenales',
      gr: 'Bruxo Elixir Des Los Terrenales'
    },
    subCategory: 'mezcal',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 610
  },
  {
    title: {
      en: 'Elemental Koch',
      gr: 'Elemental Koch'
    },
    subCategory: 'mezcal',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 620
  },

  // RUM
  {
    title: {
      en: 'Angostura 1919',
      gr: 'Angostura 1919'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 700
  },
  {
    title: {
      en: 'Angostura No5',
      gr: 'Angostura No5'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 710
  },
  {
    title: {
      en: 'Angostura No7',
      gr: 'Angostura No7'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 720
  },
  {
    title: {
      en: 'Angostura Reserva',
      gr: 'Angostura Reserva'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 730
  },
  {
    title: {
      en: 'Appelton Estate 12',
      gr: 'Appelton Estate 12'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 740
  },
  {
    title: {
      en: 'Appelton Estate Reserve Blend',
      gr: 'Appelton Estate Reserve Blend'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 750
  },
  {
    title: {
      en: 'Appelton Estate Signature',
      gr: 'Appelton Estate Signature'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 760
  },
  {
    title: {
      en: 'Bacardi Anejo',
      gr: 'Bacardi Anejo'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 770
  },
  {
    title: {
      en: 'Bacardi Carta Fuego',
      gr: 'Bacardi Carta Fuego'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 780
  },
  {
    title: {
      en: 'Bacardi Carta Oro',
      gr: 'Bacardi Carta Oro'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 790
  },
  {
    title: {
      en: 'Bacardi Reserva Ocho',
      gr: 'Bacardi Reserva Ocho'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 800
  },
  {
    title: {
      en: 'Bacardi Spiced',
      gr: 'Bacardi Spiced'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 810
  },
  {
    title: {
      en: 'Bacardi White',
      gr: 'Bacardi White'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 820
  },
  {
    title: {
      en: 'Chairmans Reserve',
      gr: 'Chairmans Reserve'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 830
  },
  {
    title: {
      en: 'Chairmans Reserve Forgotten Cask',
      gr: 'Chairmans Reserve Forgotten Cask'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 840
  },
  {
    title: {
      en: 'Clairin Communal',
      gr: 'Clairin Communal'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 850
  },
  {
    title: {
      en: 'Clairin Sajous Agricole',
      gr: 'Clairin Sajous Agricole'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 860
  },
  {
    title: {
      en: 'Clairin Vaval',
      gr: 'Clairin Vaval'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 870
  },
  {
    title: {
      en: 'Diplomatico Exclusiva Reserva',
      gr: 'Diplomatico Exclusiva Reserva'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 880
  },
  {
    title: {
      en: 'Diplomatico Manduano',
      gr: 'Diplomatico Manduano'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 890
  },
  {
    title: {
      en: 'Diplomatico Vintage 2007',
      gr: 'Diplomatico Vintage 2007'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 32.00 }
    ],
    orderRank: 900
  },
  {
    title: {
      en: 'Don Papa',
      gr: 'Don Papa'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 910
  },
  {
    title: {
      en: 'Doorley\'s 12 Years',
      gr: 'Doorley\'s 12 Years'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 14.00 }
    ],
    orderRank: 920
  },
  {
    title: {
      en: 'Doorley\'s 8 Years',
      gr: 'Doorley\'s 8 Years'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 930
  },
  {
    title: {
      en: 'Doorley\'s XO',
      gr: 'Doorley\'s XO'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 940
  },
  {
    title: {
      en: 'El Dorado 12',
      gr: 'El Dorado 12'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 950
  },
  {
    title: {
      en: 'Flor de Cana 12',
      gr: 'Flor de Cana 12'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 960
  },
  {
    title: {
      en: 'Flor de Cana 4',
      gr: 'Flor de Cana 4'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 970
  },
  {
    title: {
      en: 'Flor de Cana 7',
      gr: 'Flor de Cana 7'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 980
  },
  
  // SPICED RUM
  {
    title: {
      en: 'Angostura Taboo',
      gr: 'Angostura Taboo'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1100
  },
  {
    title: {
      en: 'Bayou Spiced',
      gr: 'Bayou Spiced'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1110
  },
  {
    title: {
      en: 'Chairmans Spiced',
      gr: 'Chairmans Spiced'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1120
  },
  {
    title: {
      en: 'Foursquare Spiced Rum',
      gr: 'Foursquare Spiced Rum'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 1130
  },
  {
    title: {
      en: 'Kraken',
      gr: 'Kraken'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1140
  },
  {
    title: {
      en: 'Sailor Jerry',
      gr: 'Sailor Jerry'
    },
    subCategory: 'spiced-rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1150
  },
  
  // IRISH WHISKEY
  {
    title: {
      en: 'Bushmils 10 Single Malt',
      gr: 'Bushmils 10 Single Malt'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 15.00 }
    ],
    orderRank: 1200
  },
  {
    title: {
      en: 'Bushmils Black Bush',
      gr: 'Bushmils Black Bush'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1210
  },
  {
    title: {
      en: 'Bushmils Original',
      gr: 'Bushmils Original'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1220
  },
  {
    title: {
      en: 'Busker',
      gr: 'Busker'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1230
  },
  {
    title: {
      en: 'Flaming Pig',
      gr: 'Flaming Pig'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 1240
  },
  {
    title: {
      en: 'Jameson',
      gr: 'Jameson'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1250
  },
  {
    title: {
      en: 'Red Breast Single Pot Still',
      gr: 'Red Breast Single Pot Still'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 1260
  },
  {
    title: {
      en: 'Roe & CO',
      gr: 'Roe & CO'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 1270
  },
  {
    title: {
      en: 'Southern Comfort',
      gr: 'Southern Comfort'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1280
  },
  {
    title: {
      en: 'Tullamore Dew',
      gr: 'Tullamore Dew'
    },
    subCategory: 'irish-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1290
  },
  
  // SCOTCH WHISKEY
  {
    title: {
      en: 'Arran Single Malt',
      gr: 'Arran Single Malt'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 1300
  },
  {
    title: {
      en: 'Coperies Single Malt',
      gr: 'Coperies Single Malt'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 1310
  },
  {
    title: {
      en: 'Dewars',
      gr: 'Dewars'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1320
  },
  {
    title: {
      en: 'Dewars Caribbean',
      gr: 'Dewars Caribbean'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1330
  },
  {
    title: {
      en: 'Glenfiddich',
      gr: 'Glenfiddich'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 1340
  },
  {
    title: {
      en: 'Heig',
      gr: 'Heig'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1350
  },
  {
    title: {
      en: 'Jameson Black Barrel',
      gr: 'Jameson Black Barrel'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 1360
  },
  {
    title: {
      en: 'Johnnie Walker Red Label',
      gr: 'Johnnie Walker Red Label'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1370
  },
  {
    title: {
      en: 'Laphroaig Islay',
      gr: 'Laphroaig Islay'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 12.00 }
    ],
    orderRank: 1380
  },
  {
    title: {
      en: 'Pig\'s Nose Blend Malt',
      gr: 'Pig\'s Nose Blend Malt'
    },
    subCategory: 'scotch-whiskey',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1390
  },
  
  // BOURBON & RYE
  {
    title: {
      en: 'Bulleit Bourbon',
      gr: 'Bulleit Bourbon'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1400
  },
  {
    title: {
      en: 'Buleit Rye',
      gr: 'Buleit Rye'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 9.50 }
    ],
    orderRank: 1410
  },
  {
    title: {
      en: 'Canadian Club',
      gr: 'Canadian Club'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1420
  },
  {
    title: {
      en: 'Jack Daniels',
      gr: 'Jack Daniels'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1430
  },
  {
    title: {
      en: 'Maker\'s Mark',
      gr: 'Maker\'s Mark'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 1440
  },
  {
    title: {
      en: 'Sazerac Rye',
      gr: 'Sazerac Rye'
    },
    subCategory: 'bourbon-rye',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 1450
  },
  
  // COGNAC
  {
    title: {
      en: 'Metaxa 3*',
      gr: 'Metaxa 3*'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 5.00 }
    ],
    orderRank: 1500
  },
  {
    title: {
      en: 'Metaxa 5*',
      gr: 'Metaxa 5*'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 6.00 }
    ],
    orderRank: 1510
  },
  {
    title: {
      en: 'Metaxa 7*',
      gr: 'Metaxa 7*'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 7.00 }
    ],
    orderRank: 1520
  },
  {
    title: {
      en: 'Hennessy Very Special',
      gr: 'Hennessy Very Special'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1530
  },
  {
    title: {
      en: 'Michael Byron Calvados',
      gr: 'Michael Byron Calvados'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1540
  },
  {
    title: {
      en: 'Martel VS',
      gr: 'Martel VS'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 1560
  },
  {
    title: {
      en: 'Mertel VS OP',
      gr: 'Mertel VS OP'
    },
    subCategory: 'cognac',
    variants: [
      { size: 'Glass', price: 0.00 }
    ],
    orderRank: 1570
  },
  
  // LIQUEUR
  {
    title: {
      en: 'Mastiha Skinos',
      gr: 'Mastiha Skinos'
    },
    subCategory: 'liqueur',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1600
  },
  {
    title: {
      en: 'Italicus',
      gr: 'Italicus'
    },
    subCategory: 'liqueur',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 1610
  },
  {
    title: {
      en: 'St. Germain',
      gr: 'St. Germain'
    },
    subCategory: 'liqueur',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1620
  },
  
  // BITTERS
  {
    title: {
      en: 'Amaro Montenegro',
      gr: 'Amaro Montenegro'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1700
  },
  {
    title: {
      en: 'Amerisse',
      gr: 'Amerisse'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1710
  },
  {
    title: {
      en: 'Aperol',
      gr: 'Aperol'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 7.00 }
    ],
    orderRank: 1720
  },
  {
    title: {
      en: 'Campari',
      gr: 'Campari'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1730
  },
  {
    title: {
      en: 'Fernet Branca',
      gr: 'Fernet Branca'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1740
  },
  {
    title: {
      en: 'Jägermeister',
      gr: 'Jägermeister'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1750
  },
  {
    title: {
      en: 'Suze',
      gr: 'Suze'
    },
    subCategory: 'bitters',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1760
  },
  
  // GREEK SPIRITS
  {
    title: {
      en: 'Axia Mastiha',
      gr: 'Axia Mastiha'
    },
    subCategory: 'greek-spirits',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1800
  },
  {
    title: {
      en: 'Ouzo 12',
      gr: 'Ouzo 12'
    },
    subCategory: 'greek-spirits',
    variants: [
      { size: 'Glass', price: 4.00 }
    ],
    orderRank: 1810
  },
  {
    title: {
      en: 'Raki',
      gr: 'Raki'
    },
    subCategory: 'greek-spirits',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 1820
  },
  {
    title: {
      en: 'Rakomelo',
      gr: 'Rakomelo'
    },
    subCategory: 'greek-spirits',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 1830
  },
  {
    title: {
      en: 'Goslings Black 151',
      gr: 'Goslings Black 151'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 13.00 }
    ],
    orderRank: 981
  },
  {
    title: {
      en: 'Goslings Black Seal',
      gr: 'Goslings Black Seal'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 982
  },
  {
    title: {
      en: 'Hampten 2016',
      gr: 'Hampten 2016'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 34.00 }
    ],
    orderRank: 983
  },
  {
    title: {
      en: 'Hanava Reserva 5',
      gr: 'Hanava Reserva 5'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 984
  },
  {
    title: {
      en: 'Havana Anejo 3',
      gr: 'Havana Anejo 3'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 985
  },
  {
    title: {
      en: 'Havana Anejo 7',
      gr: 'Havana Anejo 7'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 986
  },
  {
    title: {
      en: 'Plantation 3 stars',
      gr: 'Plantation 3 stars'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 987
  },
  {
    title: {
      en: 'Plantation Barbados Rum',
      gr: 'Plantation Barbados Rum'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 988
  },
  {
    title: {
      en: 'Plantation Original Dark',
      gr: 'Plantation Original Dark'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 989
  },
  {
    title: {
      en: 'Plantation Pineapple',
      gr: 'Plantation Pineapple'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 990
  },
  {
    title: {
      en: 'Plantation XO',
      gr: 'Plantation XO'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 991
  },
  {
    title: {
      en: 'RUM',
      gr: 'RUM'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 992
  },
  {
    title: {
      en: 'Rhum J.M',
      gr: 'Rhum J.M'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 15.00 }
    ],
    orderRank: 993
  },
  {
    title: {
      en: 'Ron Zacapa 23',
      gr: 'Ron Zacapa 23'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 17.00 }
    ],
    orderRank: 994
  },
  {
    title: {
      en: 'Rum-Bar Brown',
      gr: 'Rum-Bar Brown'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 9.00 }
    ],
    orderRank: 995
  },
  {
    title: {
      en: 'Rum-Bar White',
      gr: 'Rum-Bar White'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 8.00 }
    ],
    orderRank: 996
  },
  {
    title: {
      en: 'Rumbullion',
      gr: 'Rumbullion'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 16.00 }
    ],
    orderRank: 997
  },
  {
    title: {
      en: 'Santa Teressa',
      gr: 'Santa Teressa'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 998
  },
  {
    title: {
      en: 'Santa Teressa Solera Rum',
      gr: 'Santa Teressa Solera Rum'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 11.00 }
    ],
    orderRank: 999
  },
  {
    title: {
      en: 'Veritas',
      gr: 'Veritas'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 10.00 }
    ],
    orderRank: 1000
  },
  {
    title: {
      en: 'Worthy Park Single Estate Reserve',
      gr: 'Worthy Park Single Estate Reserve'
    },
    subCategory: 'rum',
    variants: [
      { size: 'Glass', price: 18.00 }
    ],
    orderRank: 1001
  },
];

// Transform raw items into fully formed spirit items with proper IDs and keys
const spiritItems: SpiritItem[] = rawSpiritItems.map(item => {
  // Add _key to each variant using nanoid
  const variantsWithKeys = item.variants.map(variant => ({
    ...variant,
    _key: nanoid()
  }));
  
  return {
    _type: 'spiritItem',
    title: item.title,
    description: {}, 
    subCategory: item.subCategory,
    variants: variantsWithKeys,
    orderRank: item.orderRank
  };
});

// Function to add all spirit items
async function addSpiritItems() {
  try {
    console.log('Starting to add spirit items...')
    
    const transaction = client.transaction()
    
    spiritItems.forEach((item) => {
      transaction.create(item)
    })
    
    const result = await transaction.commit()
    console.log('Successfully added all spirit items!')
    console.log(`Added ${spiritItems.length} spirit items with nanoid keys for variants`)
  } catch (err) {
    console.error('Error adding spirit items:', err)
  }
}

// Execute the function
addSpiritItems() 