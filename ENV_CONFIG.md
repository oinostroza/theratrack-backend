# Environment Configuration

Create a `.env` file in the root directory with the following variables:

## Database Configuration
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=theratrack
```

## JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## OpenAI Configuration
```
OPENAI_API_KEY=your-openai-api-key-here
```

## Application Configuration
```
NODE_ENV=development
PORT=3000
```

## Installation

Install the required packages:
```bash
npm install @nestjs/config openai --legacy-peer-deps
```

## Features

- **Environment-based configuration**: All database, JWT, and OpenAI settings are now read from environment variables
- **Production safety**: `synchronize` is automatically disabled in production
- **Fallback values**: Default values are provided for all configuration options
- **Global config**: ConfigModule is set as global for easy access throughout the application
- **AI Emotion Analysis**: OpenAI GPT-4-turbo integration for emotion analysis 