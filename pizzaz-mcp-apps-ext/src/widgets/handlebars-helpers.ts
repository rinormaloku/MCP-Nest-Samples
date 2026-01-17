import * as hbs from 'hbs';

/**
 * Register custom Handlebars helpers for widget templates
 */
export function registerHandlebarsHelpers() {
  const Handlebars = hbs.handlebars;

  // Helper to convert string to lowercase
  Handlebars.registerHelper('toLowerCase', function (str: string) {
    return str ? str.toLowerCase() : '';
  });

  // Helper to capitalize first letter
  Handlebars.registerHelper('capitalize', function (str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });

  // Helper for comparison
  Handlebars.registerHelper('eq', function (a: any, b: any) {
    return a === b;
  });

  // Helper to format dates
  Handlebars.registerHelper('formatDate', function (date: Date | string) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  // Helper to format numbers with commas
  Handlebars.registerHelper('formatNumber', function (num: number) {
    if (typeof num !== 'number') return num;
    return num.toLocaleString();
  });

  // Helper for JSON stringify (useful for debugging)
  Handlebars.registerHelper('json', function (context: any) {
    return JSON.stringify(context, null, 2);
  });

  // Helper for conditional classes
  Handlebars.registerHelper('classNames', function (...args: any[]) {
    // Remove the Handlebars options object (last argument)
    const classes = args.slice(0, -1).filter(Boolean);
    return classes.join(' ');
  });

  // Helper to add one (for index + 1)
  Handlebars.registerHelper('addOne', function (value: number) {
    return value + 1;
  });

  // Helper to check if an array has items
  Handlebars.registerHelper('hasItems', function (arr: any[]) {
    return arr && arr.length > 0;
  });

  // Helper for less than comparison
  Handlebars.registerHelper('lt', function (a: number, b: number) {
    return a < b;
  });

  // Helper for greater than comparison
  Handlebars.registerHelper('gt', function (a: number, b: number) {
    return a > b;
  });

  // Helper for subtraction
  Handlebars.registerHelper('subtract', function (a: number, b: number) {
    return a - b;
  });

  // Helper for addition
  Handlebars.registerHelper('add', function (a: number, b: number) {
    return a + b;
  });

  // Helper for multiplication
  Handlebars.registerHelper('multiply', function (a: number, b: number) {
    return a * b;
  });
}
