FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables before build
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_API_URL=https://propmatch-backend-1077352833070.us-central1.run.app
ENV NEXT_PUBLIC_PRODUCTION_API_URL=https://propmatch-backend-1077352833070.us-central1.run.app
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=1077352833070-13hpt2jjmq726b3ka2ln96r387vgqkhd.apps.googleusercontent.com
ENV NEXT_PUBLIC_USE_GCS_VIDEOS=true

# Build the application for production
RUN npm run build

EXPOSE 3000

# Use production start
CMD ["npm", "start"]