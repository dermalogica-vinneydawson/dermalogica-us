// product-quiz.js

window.productQuiz = (function() {
  let currentStep = 0;
  let userResponses = [];
  let scrapedProducts = [];

  // Configuration object to store theme settings
  const config = {
    modalBgColor: '{{ settings.quiz_modal_bg_color }}',
    buttonBgColor: '{{ settings.quiz_button_bg_color }}',
    buttonTextColor: '{{ settings.quiz_button_text_color }}',
    // Add more configuration options as needed
  };

  // Quiz questions and answers
  const quizData = [
    {
      question: '{{ settings.quiz_question_1 }}',
      answers: [
        '{{ settings.quiz_question_1_answer_1 }}',
        '{{ settings.quiz_question_1_answer_2 }}',
        '{{ settings.quiz_question_1_answer_3 }}'
      ]
    },
    {
      question: '{{ settings.quiz_question_2 }}',
      answers: [
        '{{ settings.quiz_question_2_answer_1 }}',
        '{{ settings.quiz_question_2_answer_2 }}',
        '{{ settings.quiz_question_2_answer_3 }}'
      ]
    },
    {
      question: '{{ settings.quiz_question_3 }}',
      answers: [
        '{{ settings.quiz_question_3_answer_1 }}',
        '{{ settings.quiz_question_3_answer_2 }}',
        '{{ settings.quiz_question_3_answer_3 }}'
      ]
    }
  ];

  // Function to open the modal with CSS transitions
  function openModal() {
    const modal = document.getElementById('product-quiz-modal');
    if (!modal) {
      console.error('Modal element not found');
      return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderQuizStep();
  }

  // Function to close the modal with CSS transitions
  function closeModal() {
    const modal = document.getElementById('product-quiz-modal');
    if (!modal) {
      console.error('Modal element not found');
      return;
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetQuiz();
  }

  // Function to scrape products from the page
  function scrapeProducts() {
    const productElements = document.querySelectorAll('.product-item');
    if (productElements.length === 0) {
      console.warn('No product elements found on the page. Using dummy data for testing.');
      // Use dummy data for testing when no products are found
      scrapedProducts = [
        {
          image: 'https://via.placeholder.com/150',
          title: 'Moisturizer for Dry Skin',
          price: '$29.99',
          sizes: ['30ml', '50ml', '100ml'],
          variantId: '12345'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Acne Treatment Serum',
          price: '$24.99',
          sizes: ['15ml', '30ml'],
          variantId: '67890'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Daily Cleansing Foam',
          price: '$19.99',
          sizes: ['150ml', '200ml'],
          variantId: '54321'
        }
      ];
    } else {
      scrapedProducts = Array.from(productElements).map(el => {
        return {
          image: el.querySelector('.product-image')?.src || 'https://via.placeholder.com/150',
          title: el.querySelector('.product-title')?.textContent || 'Product Title',
          price: el.querySelector('.product-price')?.textContent || '$0.00',
          sizes: Array.from(el.querySelectorAll('.product-size option')).map(opt => opt.value) || ['Default'],
          variantId: el.dataset.variantId || '0'
        };
      });
    }
    console.log('Scraped products:', scrapedProducts);
  }

  // Function to render the current quiz step
  function renderQuizStep() {
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) {
      console.error('Quiz content element not found');
      return;
    }
    const currentQuestion = quizData[currentStep];
    
    let html = `
      <h2>${currentQuestion.question}</h2>
      <div class="answer-buttons">
        ${currentQuestion.answers.map((answer, index) => `
          <button class="answer-button" data-index="${index}">${answer}</button>
        `).join('')}
      </div>
      <div class="quiz-navigation">
        ${currentStep > 0 ? '<button id="prev-button">Previous</button>' : ''}
        <span class="progress-indicator">${currentStep + 1} / ${quizData.length}</span>
      </div>
    `;
    
    quizContent.innerHTML = html;
    
    // Add event listeners to answer buttons
    document.querySelectorAll('.answer-button').forEach(button => {
      button.addEventListener('click', handleAnswer);
    });
    
    if (currentStep > 0) {
      const prevButton = document.getElementById('prev-button');
      if (prevButton) {
        prevButton.addEventListener('click', previousStep);
      }
    }

    // Animate the new content
    anime({
      targets: '#quiz-content h2, .answer-button',
      opacity: [0, 1],
      translateY: ['20px', '0px'],
      easing: 'easeOutCubic',
      duration: 300,
      delay: anime.stagger(100)
    });
  }

  // Function to handle answer selection
  function handleAnswer(event) {
    const selectedAnswer = event.target.textContent;
    userResponses[currentStep] = selectedAnswer;
    
    anime({
      targets: '.answer-button',
      opacity: [1, 0],
      translateY: ['0px', '-20px'],
      easing: 'easeInCubic',
      duration: 200,
      complete: () => {
        if (currentStep < quizData.length - 1) {
          currentStep++;
          renderQuizStep();
        } else {
          showRecommendation();
        }
      }
    });
  }

  // Function to go to the previous step
  function previousStep() {
    if (currentStep > 0) {
      currentStep--;
      renderQuizStep();
    }
  }

  // Function to show the product recommendation
  function showRecommendation() {
    const recommendedProduct = getRecommendedProduct();
    
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) {
      console.error('Quiz content element not found');
      return;
    }
    let html = `
      <h2>Your Recommended Product</h2>
      <div class="recommended-product">
        <img src="${recommendedProduct.image}" alt="${recommendedProduct.title}">
        <h3>${recommendedProduct.title}</h3>
        <p>${recommendedProduct.price}</p>
        <select id="product-size">
          ${recommendedProduct.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
        <button id="add-to-cart">ADD TO CART</button>
      </div>
      <div class="quiz-navigation">
        <button id="prev-button">Start Over</button>
      </div>
    `;
    
    quizContent.innerHTML = html;
    
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => addToCart(recommendedProduct));
    }

    const prevButton = document.getElementById('prev-button');
    if (prevButton) {
      prevButton.addEventListener('click', resetQuiz);
    }

    // Animate the recommendation content
    anime({
      targets: '.recommended-product > *, #add-to-cart',
      opacity: [0, 1],
      translateY: ['20px', '0px'],
      easing: 'easeOutCubic',
      duration: 300,
      delay: anime.stagger(100)
    });
  }

  // Function to get the recommended product based on user responses
  function getRecommendedProduct() {
    // Simple recommendation logic based on user responses
    let recommendedProductIndex = 0;
    
    // Example logic (adjust based on your specific quiz questions and product attributes)
    if (userResponses[0] === '{{ settings.quiz_question_1_answer_1 }}') { // Dry skin
      recommendedProductIndex = scrapedProducts.findIndex(product => product.title.toLowerCase().includes('moisturizer'));
    } else if (userResponses[1] === '{{ settings.quiz_question_2_answer_1 }}') { // Acne concern
      recommendedProductIndex = scrapedProducts.findIndex(product => product.title.toLowerCase().includes('acne'));
    } else if (userResponses[2] === '{{ settings.quiz_question_3_answer_1 }}') { // Daily use
      recommendedProductIndex = scrapedProducts.findIndex(product => product.title.toLowerCase().includes('daily'));
    }

    // If no specific recommendation found, return a random product
    if (recommendedProductIndex === -1) {
      recommendedProductIndex = Math.floor(Math.random() * scrapedProducts.length);
    }

    return scrapedProducts[recommendedProductIndex];
  }

  // Function to add the product to cart
  function addToCart(product) {
    const selectedSize = document.getElementById('product-size').value;
    
    // Add to cart using Shopify AJAX API
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id: product.variantId,
          quantity: 1,
          properties: {
            'Size': selectedSize
          }
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product added to cart:', data);
      closeModal();
      // Optionally, update the cart count or show a success message
    })
    .catch(error => {
      console.error('Error adding product to cart:', error);
      // Show an error message to the user
    });
  }

  // Function to reset the quiz
  function resetQuiz() {
    currentStep = 0;
    userResponses = [];
    renderQuizStep();
  }

  // Initialize the quiz
  function initQuiz() {
    const quizButton = document.getElementById('find-perfect-product');
    const closeButton = document.getElementById('close-modal');
    
    if (quizButton) {
      quizButton.addEventListener('click', openModal);
    } else {
      console.error('Quiz button not found');
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    } else {
      console.error('Close button not found');
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('product-quiz-modal');
      if (event.target === modal) {
        closeModal();
      }
    });

    // Scrape products when initializing
    scrapeProducts();
  }

  // Run initialization when DOM is loaded
  document.addEventListener('DOMContentLoaded', initQuiz);

  // Public methods
  return {
    scrapeProducts: scrapeProducts,
    openModal: openModal
  };
})();
