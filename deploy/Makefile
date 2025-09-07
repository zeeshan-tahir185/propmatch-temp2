# PropMatch Frontend Deployment Makefile

# Load environment variables
include ../.env
export

# Default values
REGION ?= us-central1
IMAGE_NAME = gcr.io/$(PROJECT_ID)/$(SERVICE_NAME)
TAG ?= latest

.PHONY: help build push deploy clean logs status

help: ## Show this help message
	@echo "PropMatch Frontend Deployment Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image locally
	@echo "🔨 Building Docker image..."
	cd .. && docker build --platform linux/amd64 -f deploy/Dockerfile -t $(IMAGE_NAME):$(TAG) .
	@echo "✅ Image built: $(IMAGE_NAME):$(TAG)"

push: build ## Build and push image to Google Container Registry
	@echo "📤 Pushing image to GCR..."
	docker push $(IMAGE_NAME):$(TAG)
	@echo "✅ Image pushed: $(IMAGE_NAME):$(TAG)"

deploy-quick: ## Quick deploy using gcloud (builds in cloud)
	@echo "🚀 Quick deploying to Cloud Run..."
	@echo "🔧 Using SERVICE_NAME: $(SERVICE_NAME)"
	@echo "🔧 Using REGION: $(REGION)"
	cd .. && gcloud builds submit --config=deploy/cloudbuild.yaml --substitutions=_SERVICE_NAME=$(SERVICE_NAME),_REGION=$(REGION)
	@echo "✅ Deployment completed!"

deploy: push ## Full deploy with local build optimized for video streaming within quota limits
	@echo "🚀 Deploying to Cloud Run optimized for video streaming..."
	gcloud run deploy $(SERVICE_NAME) \
		--image $(IMAGE_NAME):$(TAG) \
		--region $(REGION) \
		--platform managed \
		--allow-unauthenticated \
		--port 3000 \
		--memory 2Gi \
		--cpu 1 \
		--min-instances 1 \
		--max-instances 3 \
		--concurrency 150 \
		--timeout 120 \
		--service-account $(SERVICE_ACCOUNT_EMAIL)
	@echo "✅ Service deployed with video streaming optimization within quota limits!"
	@make status

status: ## Show service status and URL
	@echo "📊 Service Status:"
	@gcloud run services describe $(SERVICE_NAME) --region $(REGION) --format="value(status.url)" | sed 's/^/🌐 URL: /'
	@gcloud run services describe $(SERVICE_NAME) --region $(REGION) --format="value(status.traffic[0].percent)" | sed 's/^/📈 Traffic: /' | sed 's/$$/%%/'

logs: ## Show recent logs
	@echo "📋 Recent logs:"
	gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$(SERVICE_NAME)" --limit=50 --format="table(timestamp,severity,textPayload)"

clean: ## Remove local Docker images
	@echo "🧹 Cleaning local images..."
	docker rmi $(IMAGE_NAME):$(TAG) 2>/dev/null || true
	@echo "✅ Cleanup completed!"

setup-auth: ## Setup GCP authentication
	@echo "🔑 Setting up GCP authentication..."
	gcloud auth login
	gcloud config set project $(PROJECT_ID)
	gcloud auth configure-docker
	@echo "✅ Authentication setup completed!"