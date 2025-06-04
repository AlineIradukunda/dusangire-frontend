# Dusangire Lunch Project Setup Guide

## Prerequisites

1. Install Docker Desktop
   - Windows: Download from [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
   - Mac: Download from [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
   - Linux: Follow the [official installation guide](https://docs.docker.com/engine/install/)

2. Verify Installation
   ```bash
   docker --version
   docker-compose --version
   ```

## Running the Application

1. Clone the repository (if not already done)

2. Open terminal and navigate to project root:
   ```bash
   cd path/to/Dusingire Lunch Project
   ```

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin panel: http://localhost:8000/admin

## Troubleshooting

- If ports are already in use, modify the port mappings in docker-compose.yml
- To stop the containers: Press Ctrl+C or run `docker-compose down`
- To rebuild after making changes: `docker-compose up --build`
- To view logs: `docker-compose logs`

## Development

- Frontend code is in `./dusangire-frontend`
- Backend code is in `./dusangire_backend`
- Database data is persisted in Docker volumes
