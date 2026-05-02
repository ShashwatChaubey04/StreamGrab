# Use Node.js LTS image
FROM node:20-slim

# Install dependencies: python3 (for yt-dlp), ffmpeg (for merging), and curl
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create downloads directory in tmp
RUN mkdir -p /tmp/streamgrab-downloads

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
