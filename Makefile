# 'this best hiring tool' Project Makefile

# Install all dependencies
install:
	cd web && npm install
	cd server && pip install -r requirements.txt

# Start both services locally (for development)
# This uses the specific ports defined: 3011 (Web) and 8011 (Server)
dev:
	# Running web on 3011 and server on 8011
	powershell -Command "Start-Process cmd -ArgumentList '/k cd web && npm run dev'"
	powershell -Command "Start-Process cmd -ArgumentList '/k cd server && uvicorn main:app --reload --port 8011'"

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Clean up build artifacts
clean:
	rm -rf web/.next web/node_modules server/__pycache__ server/venv
