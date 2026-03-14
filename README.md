# 🎬 Project Dreamer Movie

A modern, responsive movie and TV show discovery application built with React and powered by The Movie Database (TMDB) API. Explore trending movies, search for your favorites, and discover detailed information about films and TV series.

![Project Dreamer Movie](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.4.5-green) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-1.9.1-purple) ![Testing](https://img.shields.io/badge/Testing-Vitest%20%2B%20Playwright-orange) ![Coverage](https://img.shields.io/badge/Coverage-Unit%20%7C%20Integration%20%7C%20E2E-brightgreen)

## ✨ Features

- **🔍 Search Functionality**: Search for movies and TV shows with real-time results
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎭 Genre Filtering**: Browse content by different genres
- **📊 Detailed Information**: View comprehensive details including ratings, cast, and synopsis
- **🎥 Video Trailers**: Watch trailers and video content
- **♾️ Infinite Scroll**: Seamless browsing experience with infinite scroll
- **⭐ Ratings Display**: Visual rating indicators with circular progress bars
- **🖼️ Lazy Loading**: Optimized image loading for better performance
- **🧪 Comprehensive Testing**: Full test coverage with unit, integration, and E2E tests
- **🚀 Performance Optimized**: Built with Vite for lightning-fast development and builds
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🚀 Installation Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Praciller/Project-Dreamer-Movie.git
   cd Project-Dreamer-Movie
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your TMDB API token:

   ```env
   VITE_APP_TMDB_TOKEN=your_tmdb_api_token_here
   ```

   To get your TMDB API token:

   - Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
   - Create an account or log in
   - Go to Settings → API
   - Request an API key and copy your API Read Access Token

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` to view the application.

## 📖 Usage Guide

### Running the Application

- **Development Mode**: `npm run dev` - Starts the development server with hot reload
- **Build for Production**: `npm run build` - Creates an optimized production build
- **Preview Production Build**: `npm run preview` - Preview the production build locally
- **Lint Code**: `npm run lint` - Run ESLint to check for code quality issues

### Testing

This project includes comprehensive testing coverage with three types of tests:

#### Unit Tests

Test individual components and functions in isolation:

```bash
npm run test:unit          # Run unit tests
npm run test              # Run all tests in watch mode
npm run test:ui           # Run tests with UI interface
```

#### Integration Tests

Test API interactions and component integration:

```bash
npm run test:integration  # Run integration tests
npm run test:coverage     # Run tests with coverage report
```

#### End-to-End (E2E) Tests

Test complete user workflows using Playwright:

```bash
npm run test:e2e          # Run E2E tests headless
npm run test:e2e:headed   # Run E2E tests with browser UI
npm run test:e2e:ui       # Run E2E tests with Playwright UI
npm run test:e2e:debug    # Debug E2E tests
```

#### Run All Tests

```bash
npm run test:all          # Run all test suites
npm run test:run          # Run all unit/integration tests once
```

#### Test Coverage

The project maintains high test coverage across:

- **Components**: React component rendering and interactions
- **Hooks**: Custom React hooks functionality
- **API Layer**: TMDB API integration and error handling
- **User Workflows**: Complete user journeys from search to details
- **Responsive Design**: Mobile and desktop compatibility
- **Error Handling**: Graceful error states and fallbacks

### Navigation

- **Home Page**: Browse trending movies and TV shows
- **Search**: Use the search bar to find specific movies or TV shows
- **Explore**: Browse movies or TV shows by category
- **Details**: Click on any movie/TV show to view detailed information
- **Genres**: Filter content by different genres

### Key Features Usage

1. **Searching Content**

   - Use the search bar in the header
   - Results update in real-time as you type
   - Navigate to dedicated search results page

2. **Viewing Details**

   - Click on any movie or TV show poster
   - View comprehensive information including cast, crew, and ratings
   - Watch trailers and related videos

3. **Exploring by Category**
   - Use the explore section to browse by media type
   - Filter by genres and sort options
   - Infinite scroll for seamless browsing

## 📁 Project Structure

```
Project-Dreamer-Movie/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/
│   ├── assets/            # Images and static resources
│   │   ├── avatar.png     # Default avatar image
│   │   ├── logo.png       # Application logo
│   │   ├── no-poster.png  # Placeholder for missing posters
│   │   └── no-results.png # No results found image
│   ├── components/        # Reusable UI components
│   │   ├── carousel/      # Carousel component for content display
│   │   ├── circleRating/  # Circular progress rating component
│   │   ├── contentWrapper/# Content wrapper for consistent layout
│   │   ├── footer/        # Application footer
│   │   ├── genres/        # Genre display components
│   │   ├── header/        # Navigation header
│   │   ├── lazyLoadImage/ # Optimized image loading component
│   │   ├── movieCard/     # Movie/TV show card component
│   │   ├── spinner/       # Loading spinner component
│   │   ├── switchTabs/    # Tab switching component
│   │   └── videoPopup/    # Video player popup component
│   ├── hooks/             # Custom React hooks
│   │   └── useFetch.jsx   # Custom hook for API data fetching
│   ├── pages/             # Application pages/routes
│   │   ├── 404/           # Page not found component
│   │   ├── details/       # Movie/TV show details page
│   │   ├── explore/       # Browse/explore page
│   │   ├── home/          # Home page component
│   │   └── searchResult/  # Search results page
│   ├── store/             # Redux store configuration
│   │   ├── homeSlice.js   # Redux slice for home page state
│   │   └── store.js       # Redux store setup
│   ├── utils/             # Utility functions
│   │   └── api.js         # API configuration and helper functions
│   ├── App.jsx            # Main application component
│   ├── App.css            # Global application styles
│   ├── index.scss         # Main stylesheet
│   ├── main.jsx           # Application entry point
│   └── mixins.scss        # SCSS mixins for reusable styles
├── index.html             # HTML template
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🛠️ Technology Stack

### Frontend Framework & Libraries

- **React 18.2.0** - Modern JavaScript library for building user interfaces
- **Vite 4.4.5** - Fast build tool and development server
- **React Router DOM 6.6.2** - Declarative routing for React applications

### State Management

- **Redux Toolkit 1.9.1** - Efficient Redux logic with less boilerplate
- **React Redux 8.0.5** - Official React bindings for Redux

### Styling & UI

- **SASS 1.57.1** - CSS preprocessor for enhanced styling capabilities
- **React Icons 4.7.1** - Popular icon library for React
- **React Circular Progressbar 2.1.0** - Circular progress indicators

### Data Fetching & API

- **Axios 1.2.2** - Promise-based HTTP client for API requests
- **TMDB API** - The Movie Database API for movie and TV show data

### Performance & UX

- **React Lazy Load Image Component 1.5.6** - Optimized image loading
- **React Infinite Scroll Component 6.1.0** - Infinite scrolling functionality
- **React Player 2.11.0** - Video player component for trailers

### Utilities

- **Day.js 1.11.7** - Lightweight date manipulation library
- **React Select 5.7.0** - Flexible select input control

### Development Tools

- **ESLint** - Code linting and quality assurance
- **Vite Plugin React** - React support for Vite

### Testing Framework

- **Vitest** - Fast unit testing framework with native ES modules support
- **Playwright** - End-to-end testing for modern web applications
- **React Testing Library** - Simple and complete testing utilities for React components
- **Jest DOM** - Custom Jest matchers for DOM node assertions
- **User Event** - Fire events the same way the user does

## 🤝 Contributing Guidelines

We welcome contributions to Project Dreamer Movie! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Project-Dreamer-Movie.git
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes** following the existing code style
2. **Test your changes** thoroughly
3. **Run the linter** to ensure code quality:
   ```bash
   npm run lint
   ```
4. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub

### Code Style Guidelines

- Use **functional components** with hooks instead of class components
- Follow **ES6+ syntax** and modern JavaScript practices
- Use **SCSS** for styling with the existing structure
- Maintain **consistent naming conventions** (camelCase for variables, PascalCase for components)
- Add **comments** for complex logic
- Ensure **responsive design** for all new components

### Types of Contributions

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Test coverage improvements**

## 📄 License Information

This project is open source and available under the [MIT License](LICENSE).

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 📞 Contact & Support

**Developer**: Pakon Poomson
**Email**: [pakon.poomson@gmail.com](mailto:pakon.poomson@gmail.com)
**GitHub**: [@Praciller](https://github.com/Praciller)
**Project Link**: [https://github.com/Praciller/pokedex-v1-project](https://github.com/Praciller/pokedex-v1-project)

### Getting Help

- 🐛 **Bug Reports**: Open an issue on GitHub with detailed reproduction steps
- 💡 **Feature Requests**: Create an issue with the "enhancement" label
- ❓ **Questions**: Reach out via email or GitHub discussions
- 📖 **Documentation**: Check this README or create an issue for clarification

### Acknowledgments

- **The Movie Database (TMDB)** for providing the comprehensive movie and TV show API
- **React Community** for the amazing ecosystem of libraries and tools
- **Vite Team** for the lightning-fast build tool
- **All Contributors** who help improve this project

---

⭐ **Star this repository** if you find it helpful!

🔗 **Share** with others who might be interested in movie discovery applications!

📢 **Follow** [@Praciller](https://github.com/Praciller) for more exciting projects!
