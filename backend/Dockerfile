# Use Node.js LTS image
FROM node:20-slim

# Install dependencies: python3, ffmpeg, and curl
# Added --fix-missing and better cleanup
RUN apt-get update --fix-missing && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Link python3 to python for yt-dlp compatibility
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install yt-dlp binary directly
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install npm dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Ensure we have a downloads directory
RUN mkdir -p /tmp/streamgrab-downloads && chmod 777 /tmp/streamgrab-downloads

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
