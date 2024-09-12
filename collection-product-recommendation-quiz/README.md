# Shopify Plus Product Recommendation Quiz

This project implements a dynamic product recommendation quiz for Shopify Plus stores using vanilla JavaScript. The quiz helps users find the right product through a series of questions and provides personalized recommendations based on their responses.

## Features

- Interactive quiz modal
- Dynamic product scraping from the current page
- Personalized product recommendations
- Responsive design for all viewports
- Customizable through Shopify Theme Customizer
- Animations for smooth user experience

## Setup

1. Clone this repository or download the ZIP file.
2. Copy the contents of the `snippets`, `sections`, `assets`, and `config` folders to your Shopify theme.
3. Include the product quiz button in your desired location by adding the following liquid tag:
   ```liquid
   {% section 'product-quiz-button' %}
   ```
4. Customize the quiz appearance and questions in the Shopify Theme Customizer.

## Files

- `snippets/product-quiz.liquid`: Main quiz template
- `sections/product-quiz-button.liquid`: Quiz button section
- `assets/product-quiz.js`: Quiz logic and functionality
- `assets/product-quiz.css`: Quiz styles
- `config/settings_schema.json`: Shopify theme settings for quiz customization

## Customization

You can customize the quiz questions, button text, and styling through the Shopify Theme Customizer. Navigate to the "Product Quiz" section in the theme editor to modify these settings.

## Development

For local development and testing:

1. Install dependencies: `npm install` (if using npm for development tools)
2. Run the development server: `python app.py` (if using Flask for development)
3. Open `http://localhost:5000` in your browser

## Dependencies

- [Anime.js](https://animejs.com/): Used for animations (loaded via CDN)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
