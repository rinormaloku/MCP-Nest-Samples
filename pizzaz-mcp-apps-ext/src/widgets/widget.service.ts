import { Injectable } from '@nestjs/common';
import * as hbs from 'hbs';
import { join } from 'path';
import { readFile } from 'fs/promises';

export interface WidgetData {
  [key: string]: any;
}

@Injectable()
export class WidgetService {
  private readonly viewsPath: string;

  constructor() {
    // Path to views directory
    // In production (webpack build), templates are in dist/widgets
    // In development, they're in views/widgets
    this.viewsPath = join(__dirname, 'widgets');
  }

  /**
   * Render a widget template with data
   * @param templateName Name of the template file (without .hbs extension)
   * @param data Data to pass to the template
   * @returns Rendered HTML string
   */
  async render(templateName: string, data: WidgetData): Promise<string> {
    console.log('Rendering widget:', templateName);
    const templatePath = join(this.viewsPath, `${templateName}.hbs`);

    try {
      // Read the template file
      const templateSource = await readFile(templatePath, 'utf-8');

      // Compile and render
      const template = hbs.handlebars.compile(templateSource);
      const html = template(data);

      return html;
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw new Error(`Failed to render widget template: ${templateName}`);
    }
  }

  /**
   * Get sample data for pizza map widget
   */
  getSamplePizzaMap(): WidgetData {
    const places = [
      {
        id: 'nova-slice-lab',
        name: 'Nova Slice Lab',
        coords: [-122.4098, 37.8001],
        description: 'Award‑winning Neapolitan pies in North Beach.',
        city: 'North Beach',
        rating: 4.8,
        price: '$$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
      },
      {
        id: 'midnight-marinara',
        name: 'Midnight Marinara',
        coords: [-122.4093, 37.7990],
        description: 'Focaccia‑style squares, late‑night favorite.',
        city: 'North Beach',
        rating: 4.6,
        price: '$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png',
      },
      {
        id: 'cinder-oven-co',
        name: 'Cinder Oven Co.',
        coords: [-122.4255, 37.7613],
        description: 'Thin‑crust classics on 18th Street.',
        city: 'Mission',
        rating: 4.5,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
      },
      {
        id: 'neon-crust-works',
        name: 'Neon Crust Works',
        coords: [-122.4388, 37.7775],
        description: 'Deep‑dish and cornmeal crust favorites.',
        city: 'Alamo Square',
        rating: 4.5,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png',
      },
      {
        id: 'luna-pie-collective',
        name: 'Luna Pie Collective',
        coords: [-122.4077, 37.7990],
        description: 'Wood‑fired pies and burrata in North Beach.',
        city: 'North Beach',
        rating: 4.6,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
      },
      {
        id: 'bricklight-deep-dish',
        name: 'Bricklight Deep Dish',
        coords: [-122.4097, 37.7992],
        description: 'Chicago‑style pies from Tony Gemignani.',
        city: 'North Beach',
        rating: 4.4,
        price: '$$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png',
      },
    ];

    return { places };
  }

  /**
   * Get sample data for pizza carousel widget
   * @param topping Optional topping filter
   */
  getSamplePizzaCarousel(topping?: string | null): WidgetData {
    const allPlaces = [
      {
        id: 'nova-slice-lab',
        name: 'Nova Slice Lab',
        description: 'Award‑winning Neapolitan pies in North Beach.',
        city: 'North Beach',
        rating: 4.8,
        price: '$$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
        specialties: ['margherita', 'pepperoni', 'neapolitan'],
      },
      {
        id: 'midnight-marinara',
        name: 'Midnight Marinara',
        description: 'Focaccia‑style squares, late‑night favorite.',
        city: 'North Beach',
        rating: 4.6,
        price: '$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png',
        specialties: ['marinara', 'margherita', 'focaccia'],
      },
      {
        id: 'cinder-oven-co',
        name: 'Cinder Oven Co.',
        description: 'Thin‑crust classics on 18th Street.',
        city: 'Mission',
        rating: 4.5,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
        specialties: ['pepperoni', 'sausage', 'thin-crust'],
      },
      {
        id: 'neon-crust-works',
        name: 'Neon Crust Works',
        description: 'Deep‑dish and cornmeal crust favorites.',
        city: 'Alamo Square',
        rating: 4.5,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png',
        specialties: ['deep-dish', 'sausage', 'pepperoni'],
      },
      {
        id: 'luna-pie-collective',
        name: 'Luna Pie Collective',
        description: 'Wood‑fired pies and burrata in North Beach.',
        city: 'North Beach',
        rating: 4.6,
        price: '$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
        specialties: ['margherita', 'burrata', 'vegetarian'],
      },
      {
        id: 'bricklight-deep-dish',
        name: 'Bricklight Deep Dish',
        description: 'Chicago‑style pies from Tony Gemignani.',
        city: 'North Beach',
        rating: 4.4,
        price: '$$$',
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png',
        specialties: ['deep-dish', 'chicago-style', 'sausage'],
      },
    ];

    // Filter by topping if specified
    let places = allPlaces;
    if (topping && topping.toLowerCase() !== 'all') {
      const normalizedTopping = topping.toLowerCase().trim();
      places = allPlaces.filter((place: any) =>
        place.specialties?.some((s: string) => s.toLowerCase() === normalizedTopping),
      );
    }

    return { places, filterTopping: topping || 'all' };
  }

  /**
   * Get sample data for pizza list widget
   */
  getSamplePizzaList(): WidgetData {
    const places = [
      {
        id: 'nova-slice-lab',
        name: 'Nova Slice Lab',
        city: 'North Beach',
        rating: 4.8,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
        specialties: ['margherita', 'pepperoni', 'neapolitan'],
      },
      {
        id: 'midnight-marinara',
        name: 'Midnight Marinara',
        city: 'North Beach',
        rating: 4.6,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png',
        specialties: ['marinara', 'margherita', 'focaccia'],
      },
      {
        id: 'cinder-oven-co',
        name: 'Cinder Oven Co.',
        city: 'Mission',
        rating: 4.5,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
        specialties: ['pepperoni', 'sausage', 'thin-crust'],
      },
      {
        id: 'neon-crust-works',
        name: 'Neon Crust Works',
        city: 'Alamo Square',
        rating: 4.5,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png',
        specialties: ['deep-dish', 'sausage', 'pepperoni'],
      },
      {
        id: 'luna-pie-collective',
        name: 'Luna Pie Collective',
        city: 'North Beach',
        rating: 4.6,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
        specialties: ['margherita', 'burrata', 'vegetarian'],
      },
      {
        id: 'bricklight-deep-dish',
        name: 'Bricklight Deep Dish',
        city: 'North Beach',
        rating: 4.4,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png',
        specialties: ['deep-dish', 'chicago-style', 'sausage'],
      },
      {
        id: 'garden-ember-pies',
        name: 'Garden Ember Pies',
        city: 'Lower Haight',
        rating: 4.4,
        thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
        specialties: ['vegetarian', 'vegan', 'margherita'],
      },
    ];

    return {
      title: 'National Best Pizza List',
      subtitle: 'A ranking of the best pizzerias in the world',
      places,
    };
  }

  /**
   * Get sample data for pizza list widget filtered by topping
   * Demonstrates ResourceTemplate with URI parameters
   * @param topping The topping to filter by (e.g., 'pepperoni', 'margherita', 'vegetarian')
   */
  getSamplePizzaListByTopping(topping = "all"): WidgetData {
    console.log('Filtering pizza list by topping:', topping);
    const allData = this.getSamplePizzaList();
    const allPlaces = allData.places;

    // Normalize topping for comparison
    const normalizedTopping = topping.toLowerCase().trim();

    // Filter places by topping specialty
    const filteredPlaces =
      normalizedTopping === 'all'
        ? allPlaces
        : allPlaces.filter((place: any) =>
            place.specialties?.some((s: string) => s.toLowerCase() === normalizedTopping),
          );

    // Create friendly topping name for title
    const toppingName = normalizedTopping
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title:
        normalizedTopping === 'all'
          ? 'National Best Pizza List'
          : `Best ${toppingName} Pizza Places`,
      subtitle:
        normalizedTopping === 'all'
          ? 'A ranking of the best pizzerias in the world'
          : `Top pizzerias specializing in ${toppingName.toLowerCase()} pizzas`,
      places: filteredPlaces,
    };
  }

  /**
   * Get sample data for pizza albums widget
   * @param topping Optional topping filter (e.g., 'pepperoni', 'truffle')
   */
  getSamplePizzaAlbums(topping?: string | null): WidgetData {
    const allAlbums = [
      {
        id: 'summer-escape',
        title: 'Summer Slice',
        topping: 'margherita',
        cover: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
        photos: [
          { id: 's1', title: 'Waves', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png' },
          { id: 's2', title: 'Palm trees', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png' },
          { id: 's3', title: 'Sunset', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png' },
        ],
      },
      {
        id: 'city-lights',
        title: 'Pepperoni Nights',
        topping: 'pepperoni',
        cover: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
        photos: [
          { id: 'c1', title: 'Downtown', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png' },
          { id: 'c2', title: 'Neon', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png' },
          { id: 'c3', title: 'Streets', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png' },
        ],
      },
      {
        id: 'into-the-woods',
        title: 'Truffle Forest',
        topping: 'truffle',
        cover: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
        photos: [
          { id: 'n1', title: 'Forest path', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png' },
          { id: 'n2', title: 'Misty', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png' },
          { id: 'n3', title: 'Waterfall', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png' },
        ],
      },
      {
        id: 'pizza-tour',
        title: 'Pizza Tour',
        topping: 'mixed',
        cover: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
        photos: [
          { id: 'p1', title: "Tony's Pizza Napoletana", url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png' },
          { id: 'p2', title: 'Golden Boy Pizza', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png' },
          { id: 'p3', title: 'Pizzeria Delfina', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png' },
          { id: 'p4', title: 'Ragazza', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png' },
          { id: 'p5', title: 'Del Popolo', url: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png' },
        ],
      },
    ];

    // Filter albums by topping if specified
    let albums = allAlbums;
    if (topping && topping.toLowerCase() !== 'all') {
      const normalizedTopping = topping.toLowerCase().trim();
      albums = allAlbums.filter(
        (album) => album.topping.toLowerCase() === normalizedTopping,
      );
    }

    return { albums, filterTopping: topping || 'all' };
  }

  /**
   * Get all available widget examples
   */
  getAllWidgetExamples(): Array<{ name: string; description: string; template: string }> {
    return [
      {
        name: 'Pizza Map',
        description: 'Interactive map showing pizza place locations with sidebar and details',
        template: 'pizza-map',
      },
      {
        name: 'Pizza Carousel',
        description: 'Swipeable carousel of pizza places with images and ratings',
        template: 'pizza-carousel',
      },
      {
        name: 'Pizza List',
        description: 'Ranked list of best pizzerias with save functionality',
        template: 'pizza-list',
      },
      {
        name: 'Pizza Albums',
        description: 'Photo album grid with preview thumbnails',
        template: 'pizza-albums',
      },
    ];
  }
}
