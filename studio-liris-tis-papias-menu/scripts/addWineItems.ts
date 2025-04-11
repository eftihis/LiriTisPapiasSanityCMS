import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'

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

// Define the wine item type
type WineItem = {
  _type: string
  title: {
    en: string
    gr: string
  }
  description: {
    en: string
    gr: string
  }
  grapeVarieties: {
    en: string
    gr: string
  }
  subCategory: string
  glassPrice: number
  bottlePrice?: number
  orderRank: number
}

const wineItems: WineItem[] = [
  // Sparkling Wines
  {
    _type: 'wineItem',
    title: {
      en: 'Prosecco La Farra',
      gr: 'Prosecco La Farra'
    },
    description: {
      en: 'Refreshing & fruity',
      gr: 'Δροσιστικό & φρουτώδες'
    },
    grapeVarieties: {
      en: 'Glera',
      gr: 'Glera'
    },
    subCategory: 'sparkling-wine',
    glassPrice: 5.00,
    bottlePrice: 24.00,
    orderRank: 10
  },
  {
    _type: 'wineItem',
    title: {
      en: "Moscato D'asti Beppe Marino",
      gr: "Moscato D'asti Beppe Marino"
    },
    description: {
      en: 'Intensely aromatic & fruity',
      gr: 'Έντονα αρωματικό & φρουτώδες'
    },
    grapeVarieties: {
      en: 'Muscat',
      gr: 'Muscat'
    },
    subCategory: 'sparkling-wine',
    glassPrice: 5.00,
    bottlePrice: 24.00,
    orderRank: 20
  },

  // White Wines
  {
    _type: 'wineItem',
    title: {
      en: 'Manousakis Moscato Spinas',
      gr: 'Μανουσάκης Moscato Spinas'
    },
    description: {
      en: 'Aromatic, fruity & fatty',
      gr: 'Αρωματικό, φρουτώδες & λιπαρό'
    },
    grapeVarieties: {
      en: 'Muscat of Spina',
      gr: 'Μοσχάτο Σπίνας'
    },
    subCategory: 'white-wine',
    glassPrice: 36.00,
    orderRank: 30
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Liraraki Plyto',
      gr: 'Ληραράκη Πλυτό'
    },
    description: {
      en: 'Fruity, rich & Mineral',
      gr: 'Φρουτώδες, πλούσιο & μεταλλικό'
    },
    grapeVarieties: {
      en: 'Plyto',
      gr: 'Πλυτό'
    },
    subCategory: 'white-wine',
    glassPrice: 6.50,
    bottlePrice: 32.00,
    orderRank: 40
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Zafiraki Mikrokosmos',
      gr: 'Ζαφειράκη Μικρόκοσμος'
    },
    description: {
      en: 'Light, aromatic and fruity',
      gr: 'Ελαφρύ, αρωματικό και φρουτώδες'
    },
    grapeVarieties: {
      en: 'Malagouzia',
      gr: 'Μαλαγουζιά'
    },
    subCategory: 'white-wine',
    glassPrice: 36.00,
    orderRank: 50
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Vasaltis Nasitis',
      gr: 'Βασάλτης Νασίτης'
    },
    description: {
      en: 'Refreshing & Mineral',
      gr: 'Δροσιστικό & μεταλλικό'
    },
    grapeVarieties: {
      en: 'Asirtiko, Athiri, Aidani',
      gr: 'Ασύρτικο, Αθήρι, Αηδάνι'
    },
    subCategory: 'white-wine',
    glassPrice: 45.00,
    orderRank: 60
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Endochora Vidiano',
      gr: 'Ενδοχώρα Βιδιανό'
    },
    description: {
      en: 'Full & fatty',
      gr: 'Γεμάτο & λιπαρό'
    },
    grapeVarieties: {
      en: 'Vidiano',
      gr: 'Βιδιανό'
    },
    subCategory: 'white-wine',
    glassPrice: 5.50,
    bottlePrice: 27.50,
    orderRank: 70
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Dourakis Rizitis',
      gr: 'Δουράκη Ριζίτης'
    },
    description: {
      en: 'Light & fruity',
      gr: 'Ελαφρύ & φρουτώδες'
    },
    grapeVarieties: {
      en: 'Vilana',
      gr: 'Βηλάνα'
    },
    subCategory: 'white-wine',
    glassPrice: 4.00,
    bottlePrice: 17.00,
    orderRank: 80
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Mastello Semi-Sweet',
      gr: 'Μαστέλλο Ημίγλυκο'
    },
    description: {
      en: 'Semi-sweet white wine',
      gr: 'Ημίγλυκο λευκό κρασί'
    },
    grapeVarieties: {
      en: 'Vilana, Vidiano',
      gr: 'Βηλάνα, Βιδιανό'
    },
    subCategory: 'white-wine',
    glassPrice: 4.00,
    bottlePrice: 18.00,
    orderRank: 90
  },

  // Rose Wines
  {
    _type: 'wineItem',
    title: {
      en: 'Gavalas An',
      gr: 'Γαβαλάς Αν'
    },
    description: {
      en: 'Off dry, fruity & aromatic',
      gr: 'Ημίξηρο, φρουτώδες & αρωματικό'
    },
    grapeVarieties: {
      en: 'Cabernet Sauvignon, Kotsifali',
      gr: 'Cabernet Sauvignon, Κοτσιφάλι'
    },
    subCategory: 'rose-wine',
    glassPrice: 4.50,
    bottlePrice: 22.00,
    orderRank: 100
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Tehni Alipias',
      gr: 'Τέχνη Αλυπίας'
    },
    description: {
      en: 'Refreshing & aromatic',
      gr: 'Δροσιστικό & αρωματικό'
    },
    grapeVarieties: {
      en: 'Syrah',
      gr: 'Syrah'
    },
    subCategory: 'rose-wine',
    glassPrice: 6.50,
    bottlePrice: 32.00,
    orderRank: 110
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Thimiopoulos Pose de Xinomavro',
      gr: 'Θυμιόπουλος Pose de Ξινόμαυρο'
    },
    description: {
      en: 'Full, complex & fatty',
      gr: 'Γεμάτο, πολύπλοκο & λιπαρό'
    },
    grapeVarieties: {
      en: 'Xinomavro',
      gr: 'Ξινόμαυρο'
    },
    subCategory: 'rose-wine',
    glassPrice: 6.00,
    bottlePrice: 30.00,
    orderRank: 120
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Liraraki Madilari',
      gr: 'Ληραράκη Μαντηλάρι'
    },
    description: {
      en: 'Light & fruity',
      gr: 'Ελαφρύ & φρουτώδες'
    },
    grapeVarieties: {
      en: 'Madilari',
      gr: 'Μαντηλάρι'
    },
    subCategory: 'rose-wine',
    glassPrice: 4.50,
    bottlePrice: 18.00,
    orderRank: 130
  },

  // Red Wines
  {
    _type: 'wineItem',
    title: {
      en: 'Tetramithos Mavro Kalavritiko Natur',
      gr: 'Τετράμυθος Μαύρο Καλαβρυτινό Natur'
    },
    description: {
      en: 'Light & aromatic',
      gr: 'Ελαφρύ & αρωματικό'
    },
    grapeVarieties: {
      en: 'Mavro Kalavritiko',
      gr: 'Μαύρο Καλαβρυτινό'
    },
    subCategory: 'red-wine',
    glassPrice: 5.50,
    bottlePrice: 27.00,
    orderRank: 140
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Manousakis Grenache',
      gr: 'Μανουσάκης Grenache'
    },
    description: {
      en: 'Finesse & complex',
      gr: 'Φινετσάτο & πολύπλοκο'
    },
    grapeVarieties: {
      en: 'Grenache',
      gr: 'Grenache'
    },
    subCategory: 'red-wine',
    glassPrice: 55.00,
    orderRank: 150
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Thimiopoulos Alta',
      gr: 'Θυμιόπουλος Alta'
    },
    description: {
      en: 'Aromatic & earthy',
      gr: 'Αρωματικό & γήινο'
    },
    grapeVarieties: {
      en: 'Xinomavro',
      gr: 'Ξινόμαυρο'
    },
    subCategory: 'red-wine',
    glassPrice: 7.00,
    bottlePrice: 34.50,
    orderRank: 160
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Endochora Kotsifali',
      gr: 'Ενδοχώρα Κοτσιφάλι'
    },
    description: {
      en: 'Spiced & soft',
      gr: 'Μπαχαρένιο & απαλό'
    },
    grapeVarieties: {
      en: 'Kotsifali',
      gr: 'Κοτσιφάλι'
    },
    subCategory: 'red-wine',
    glassPrice: 6.50,
    bottlePrice: 31.00,
    orderRank: 170
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Tehni Alipias',
      gr: 'Τέχνη Αλυπίας'
    },
    description: {
      en: 'Round & juicy',
      gr: 'Στρογγυλό & ζουμερό'
    },
    grapeVarieties: {
      en: 'Cabernet Sauvignon, Agiorgitiko',
      gr: 'Cabernet Sauvignon, Αγιωργίτικο'
    },
    subCategory: 'red-wine',
    glassPrice: 39.50,
    orderRank: 180
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Dourakis Rizitis',
      gr: 'Δουράκη Ριζίτης'
    },
    description: {
      en: 'Light & fruity',
      gr: 'Ελαφρύ & φρουτώδες'
    },
    grapeVarieties: {
      en: 'Merlot, Grenache Rouge',
      gr: 'Merlot, Grenache Rouge'
    },
    subCategory: 'red-wine',
    glassPrice: 3.50,
    bottlePrice: 17.00,
    orderRank: 190
  },
  {
    _type: 'wineItem',
    title: {
      en: 'Mastello Semi-Sweet',
      gr: 'Μαστέλλο Ημίγλυκο'
    },
    description: {
      en: 'Semi-sweet red wine',
      gr: 'Ημίγλυκο κόκκινο κρασί'
    },
    grapeVarieties: {
      en: 'Syrah, Kotsifali',
      gr: 'Syrah, Κοτσιφάλι'
    },
    subCategory: 'red-wine',
    glassPrice: 4.00,
    bottlePrice: 18.00,
    orderRank: 200
  }
]

async function addWineItems() {
  try {
    const transaction = client.transaction()
    wineItems.forEach((item) => {
      transaction.create(item)
    })
    console.log('Starting to add wine items...')
    const result = await transaction.commit()
    console.log('Successfully added all wine items!', result)
  } catch (error) {
    console.error('Error adding wine items:', error)
  }
}

addWineItems() 