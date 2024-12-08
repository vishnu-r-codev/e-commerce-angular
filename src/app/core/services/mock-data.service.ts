import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type CategoryType = 'Electronics' | 'Clothing' | 'Books' | 'Home & Kitchen' | 'Sports' | 'Beauty' | 'Toys' | 'Jewelry';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CategoryType;
  rating: number;
  stock: number;
  brand?: string;
  model?: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface CategoryTemplates {
  Electronics: string[];
  Clothing: string[];
  Books: string[];
  'Home & Kitchen': string[];
  Sports: string[];
  Beauty: string[];
  Toys: string[];
  Jewelry: string[];
}

interface PriceRanges {
  Electronics: PriceRange;
  Clothing: PriceRange;
  Books: PriceRange;
  'Home & Kitchen': PriceRange;
  Sports: PriceRange;
  Beauty: PriceRange;
  Toys: PriceRange;
  Jewelry: PriceRange;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private categories: CategoryType[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Kitchen',
    'Sports',
    'Beauty',
    'Toys',
    'Jewelry'
  ];

  private productTemplates: CategoryTemplates = {
    Electronics: [
      'Wireless {{color}} Headphones',
      '{{size}}-inch {{brand}} Smart TV',
      '{{brand}} Smartphone {{gen}}',
      '{{brand}} Bluetooth Speaker',
      'Gaming Laptop {{brand}} {{series}}',
      'Smartwatch {{brand}} {{series}}',
      'Wireless Earbuds {{brand}}',
      'Tablet Pro {{brand}} {{gen}}',
      'Digital Camera {{brand}} {{series}}',
      'Gaming Console {{brand}} {{gen}}'
    ],
    Clothing: [
      '{{color}} {{type}} Shirt',
      '{{brand}} Denim Jeans',
      'Casual {{color}} {{type}} Dress',
      'Winter {{type}} Jacket',
      '{{brand}} Running Shoes',
      '{{color}} Yoga Pants',
      '{{type}} Sweater {{color}}',
      'Formal Suit {{color}}',
      'Summer Shorts {{type}}',
      'Athletic Socks {{brand}}'
    ],
    Books: [
      'The Art of {{topic}}',
      'Complete Guide to {{topic}}',
      '{{genre}} Collection Vol. {{volume}}',
      'Beginner\'s Guide to {{topic}}',
      'Advanced {{topic}} Techniques',
      'Essential {{topic}} Handbook',
      'Modern {{topic}} Practice',
      '{{genre}} Anthology {{year}}',
      'Understanding {{topic}} Today',
      'Professional {{topic}} Development'
    ],
    'Home & Kitchen': [
      '{{brand}} Smart Coffee Maker',
      'Professional {{brand}} Knife Set',
      'Smart Home {{appliance}}',
      'Automatic {{appliance}} Maker',
      'Premium Cookware Set {{brand}}',
      'Electric {{appliance}} Pro',
      'Digital Air Fryer {{brand}}',
      'Stainless Steel {{appliance}}',
      'Modern Kitchen {{appliance}}',
      'Luxury {{appliance}} System'
    ],
    Sports: [
      'Professional {{sport}} {{equipment}}',
      '{{brand}} Training Set',
      'Competition {{sport}} Gear',
      'Premium {{sport}} Equipment',
      'Advanced Fitness Kit',
      'Performance {{sport}} Wear',
      'Elite {{sport}} {{equipment}}',
      '{{brand}} Pro Series',
      'Outdoor {{sport}} Gear',
      'Fitness Tracker {{brand}}'
    ],
    Beauty: [
      'Premium {{type}} Care Set',
      '{{brand}} Professional Treatment',
      'Organic {{type}} Collection',
      'Advanced {{type}} Formula',
      'Natural {{type}} Solution',
      'Luxury {{brand}} Package',
      'Essential Beauty Kit',
      'Daily Skincare Routine Set',
      'Intensive {{type}} Therapy',
      'Complete {{type}} System'
    ],
    Toys: [
      'Interactive {{type}} Set',
      'Educational {{age}} Kit',
      'Remote Control {{vehicle}}',
      'Building Blocks {{theme}}',
      'Creative Art Set {{age}}',
      'Adventure {{theme}} Pack',
      'Classic Board Game Set',
      'Smart Learning System',
      'Junior Science Kit',
      'Premium {{theme}} Collection'
    ],
    Jewelry: [
      '{{metal}} {{type}} with {{stone}}',
      'Designer {{type}} Collection',
      'Vintage {{metal}} {{type}}',
      'Modern {{type}} Set',
      'Classic {{metal}} Ring',
      'Luxury {{type}} {{metal}}',
      'Handcrafted {{type}}',
      'Statement {{type}} {{stone}}',
      'Elegant {{metal}} Set',
      'Royal {{type}} Collection'
    ]
  };

  private variants = {
    colors: ['Black', 'White', 'Navy', 'Red', 'Grey', 'Silver', 'Gold', 'Rose Gold', 'Blue', 'Green'],
    brands: ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo', 'Nike', 'Adidas'],
    sizes: ['32', '43', '50', '55', '65', '75', '85'],
    series: ['Series 3', 'Series 4', 'Series 5', 'Series 6', 'Series 7', 'Pro', 'Elite', 'Ultra'],
    gens: ['2023 Edition', 'Gen 5', 'Gen 6', 'Latest Gen', 'Pro Model'],
    types: ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Premium', 'Luxury', 'Classic'],
    topics: ['Programming', 'Design', 'Business', 'Science', 'History', 'Art', 'Technology', 'Health'],
    genres: ['Mystery', 'Romance', 'Sci-Fi', 'Biography', 'Self-Help', 'Fiction', 'Fantasy'],
    volumes: ['1', '2', '3', 'Special Edition', 'Complete Set'],
    years: ['2023', '2024', 'Latest Edition', 'Revised Edition'],
    appliances: ['Blender', 'Mixer', 'Toaster', 'Food Processor', 'Rice Cooker', 'Pressure Cooker'],
    sports: ['Yoga', 'Running', 'Tennis', 'Basketball', 'Football', 'Swimming', 'Cycling'],
    equipment: ['Mat', 'Shoes', 'Racket', 'Ball', 'Gear', 'Equipment', 'Accessories'],
    beautyTypes: ['Skin', 'Hair', 'Face', 'Body', 'Eye', 'Lip'],
    toyTypes: ['Robot', 'Doll', 'Vehicle', 'Puzzle', 'Game'],
    toyThemes: ['Space', 'City', 'Fantasy', 'Adventure', 'Science'],
    ages: ['3+', '5+', '7+', '10+', 'Teen'],
    vehicles: ['Car', 'Drone', 'Robot', 'Helicopter', 'Truck'],
    metals: ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold'],
    stones: ['Diamond', 'Sapphire', 'Ruby', 'Emerald', 'Pearl'],
    jewelryTypes: ['Necklace', 'Bracelet', 'Ring', 'Earrings', 'Pendant']
  };

  private priceRanges: PriceRanges = {
    Electronics: { min: 99, max: 2999 },
    Clothing: { min: 29, max: 299 },
    Books: { min: 9, max: 99 },
    'Home & Kitchen': { min: 49, max: 799 },
    Sports: { min: 19, max: 499 },
    Beauty: { min: 19, max: 299 },
    Toys: { min: 14, max: 199 },
    Jewelry: { min: 99, max: 9999 }
  };

  private descriptionTemplates: CategoryTemplates = {
    Electronics: [
      'High-performance {{name}} featuring cutting-edge technology and premium build quality',
      'Premium {{name}} with advanced features and sleek modern design',
      'Next-generation {{name}} for ultimate performance and reliability',
      'Professional-grade {{name}} with innovative features and superior quality'
    ],
    Clothing: [
      'Stylish {{name}} made with premium quality materials for lasting comfort',
      'Trendy {{name}} perfect for any occasion with excellent fit and comfort',
      'Classic {{name}} featuring modern design and superior craftsmanship',
      'Elegant {{name}} with attention to detail and premium finish'
    ],
    Books: [
      'Comprehensive guide exploring the world of {{name}} with expert insights',
      'In-depth exploration of {{name}} with practical examples and case studies',
      'Essential resource for mastering {{name}} with detailed explanations',
      'Complete guide to understanding {{name}} with professional techniques'
    ],
    'Home & Kitchen': [
      'Premium quality {{name}} designed for modern homes and busy lifestyles',
      'Professional-grade {{name}} with innovative features for everyday use',
      'High-performance {{name}} combining style and functionality',
      'Advanced {{name}} with smart features and elegant design'
    ],
    Sports: [
      'Professional-grade {{name}} designed for optimal performance',
      'High-quality {{name}} for serious athletes and fitness enthusiasts',
      'Premium {{name}} engineered for maximum durability and comfort',
      'Advanced {{name}} featuring innovative design and superior materials'
    ],
    Beauty: [
      'Premium {{name}} formulated with high-quality ingredients',
      'Advanced {{name}} for professional-grade beauty care',
      'Luxury {{name}} designed for exceptional results',
      'Natural {{name}} with carefully selected ingredients for gentle care'
    ],
    Toys: [
      'Educational {{name}} designed to inspire creativity and learning',
      'Interactive {{name}} perfect for endless hours of fun',
      'High-quality {{name}} built to last with safety in mind',
      'Engaging {{name}} that combines entertainment with education'
    ],
    Jewelry: [
      'Exquisite {{name}} crafted with attention to detail',
      'Elegant {{name}} featuring timeless design and premium materials',
      'Luxurious {{name}} perfect for special occasions',
      'Handcrafted {{name}} with superior quality and stunning finish'
    ]
  };

  private products: Product[] = this.generateMockProducts();

  private generateMockProducts(): Product[] {
    let products: Product[] = [];
    let id = 1;

    this.categories.forEach((category: CategoryType) => {
      for (let i = 0; i < 50; i++) {
        let name = '';
        let description = '';
        let price = 0;
        let image = '';

        // Generate category-specific details
        switch (category) {
          case 'Electronics':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{color}}/g, this.getRandomItem(this.variants.colors))
              .replace(/{{brand}}/g, this.getRandomItem(this.variants.brands))
              .replace(/{{size}}/g, this.getRandomItem(this.variants.sizes))
              .replace(/{{series}}/g, this.getRandomItem(this.variants.series))
              .replace(/{{gen}}/g, this.getRandomItem(this.variants.gens));
            break;

          case 'Clothing':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{color}}/g, this.getRandomItem(this.variants.colors))
              .replace(/{{brand}}/g, this.getRandomItem(this.variants.brands))
              .replace(/{{type}}/g, this.getRandomItem(this.variants.types));
            break;

          case 'Books':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{topic}}/g, this.getRandomItem(this.variants.topics))
              .replace(/{{genre}}/g, this.getRandomItem(this.variants.genres))
              .replace(/{{volume}}/g, this.getRandomItem(this.variants.volumes))
              .replace(/{{year}}/g, this.getRandomItem(this.variants.years));
            break;

          case 'Home & Kitchen':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{brand}}/g, this.getRandomItem(this.variants.brands))
              .replace(/{{appliance}}/g, this.getRandomItem(this.variants.appliances));
            break;

          case 'Sports':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{brand}}/g, this.getRandomItem(this.variants.brands))
              .replace(/{{sport}}/g, this.getRandomItem(this.variants.sports))
              .replace(/{{equipment}}/g, this.getRandomItem(this.variants.equipment));
            break;

          case 'Beauty':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{brand}}/g, this.getRandomItem(this.variants.brands))
              .replace(/{{type}}/g, this.getRandomItem(this.variants.beautyTypes));
            break;

          case 'Toys':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{type}}/g, this.getRandomItem(this.variants.toyTypes))
              .replace(/{{age}}/g, this.getRandomItem(this.variants.ages))
              .replace(/{{theme}}/g, this.getRandomItem(this.variants.toyThemes))
              .replace(/{{vehicle}}/g, this.getRandomItem(this.variants.vehicles));
            break;

          case 'Jewelry':
            name = this.getRandomTemplate(this.productTemplates[category])
              .replace(/{{metal}}/g, this.getRandomItem(this.variants.metals))
              .replace(/{{type}}/g, this.getRandomItem(this.variants.jewelryTypes))
              .replace(/{{stone}}/g, this.getRandomItem(this.variants.stones));
            break;
        }

        // Get price range for category
        const priceRange = this.priceRanges[category];
        price = this.getRandomPrice(priceRange.min, priceRange.max);

        // Generate description using template
        description = this.getRandomTemplate(this.descriptionTemplates[category])
          .replace(/{{name}}/g, name.toLowerCase());

        // Generate image URL
        image = `https://placehold.co/400x300/333/fff?text=${encodeURIComponent(name)}`;

        products.push({
          id: id++,
          name,
          description,
          price,
          image,
          category,
          stock: Math.floor(Math.random() * 100) + 1,
          rating: this.generateRating()
        });
      }
    });

    return products;
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomTemplate(templates: string[]): string {
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private getRandomPrice(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  }

  private generateRating(): number {
    // Skew ratings towards higher values (4-5 stars)
    const baseRating = Math.random();
    if (baseRating > 0.9) {
      // 10% chance of perfect 5.0
      return 5.0;
    } else if (baseRating > 0.7) {
      // 20% chance of 4.5-4.9
      return Number((4.5 + Math.random() * 0.5).toFixed(1));
    } else if (baseRating > 0.4) {
      // 30% chance of 4.0-4.4
      return Number((4.0 + Math.random() * 0.5).toFixed(1));
    } else if (baseRating > 0.2) {
      // 20% chance of 3.5-3.9
      return Number((3.5 + Math.random() * 0.5).toFixed(1));
    } else {
      // 20% chance of 3.0-3.4
      return Number((3.0 + Math.random() * 0.5).toFixed(1));
    }
  }

  getCategories(): Observable<CategoryType[]> {
    return of(this.categories);
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductsByCategory(category: CategoryType): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.category === category);
    return of(filteredProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  searchProducts(query: string): Observable<Product[]> {
    query = query.toLowerCase();
    const searchResults = this.products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    return of(searchResults);
  }
} 