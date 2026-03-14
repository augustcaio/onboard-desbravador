# Use a Node.js base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lighter weight image for running the application
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables (if any) - note: actual values will be set at deploy time
# We'll leave these empty and set them in the Cloud Run deployment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]