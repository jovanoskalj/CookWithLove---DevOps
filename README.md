# CookWithLove – Fullstack App with Docker, Kubernetes, and CI/CD

This project is a demonstration of a modern fullstack application deployment using Docker, Kubernetes, and GitHub Actions. The app consists of a React frontend, Flask backend, and MongoDB database, and is deployed both locally (with Docker Compose/Kubernetes) and remotely (via [Render.com](https://render.com/)).

---

## 🌟 Features

- **Multi-service architecture:** React (frontend), Flask (backend), MongoDB (database)
- **Dockerized:** Each component runs in its own Docker container
- **Kubernetes-ready:** Manifests for Deployments, Services, StatefulSet, ConfigMap, Secret, and Ingress
- **CI/CD:** GitHub Actions pipelines build and push Docker images
- **Works locally and remotely:** 
  - Local: via Docker Compose or Kubernetes (`localhost:3001` for frontend)
  - Remote: Deployed at [Render.com](https://render.com/)
- **Secure:** Uses Kubernetes Secrets and ConfigMaps for configuration

---

## 🚀 Quick Start

### 1. **Local Setup with Docker Compose**

1. **Clone the repo:**
   ```sh
   git clone https://github.com/<your-username>/cookwithlove.git
   cd cookwithlove
   ```

2. **Copy `.env.example` to `.env`** and fill in MongoDB credentials.

3. **Start all services:**
   ```sh
   docker-compose up --build
   ```

4. **Visit the app:**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend: [http://localhost:5050](http://localhost:5050)

---

### 2. **Kubernetes Deployment**

#### Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Kubernetes cluster (Minikube, Docker Desktop, or cloud)
- [nginx-ingress](https://kubernetes.github.io/ingress-nginx/)

#### Instructions

```sh
# 1. Namespace & configuration
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongo-secret.yaml
kubectl apply -f k8s/backend-configmap.yaml

# 2. Database
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/mongodb-service.yaml

# 3. Application
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# 4. Ingress
kubectl apply -f k8s/ingress.yaml

# 5. Add to /etc/hosts (replace IP with your ingress IP, e.g. from `minikube ip`)
192.168.49.2 cookwithlove.local

# Now visit:
# http://cookwithlove.local
```

---

### 3. **Deployed on Render**

- The application is live and accessible on [Render.com](https://render.com/)
- Both frontend and backend services are deployed as separate services.

---

## 🛠️ Configuration

- **Secrets:**  
  Stores MongoDB credentials and Flask `SECRET_KEY`, base64 encoded in `mongo-secret.yaml`.
- **ConfigMaps:**  
  Stores non-sensitive configuration (DB name, ports) in `backend-configmap.yaml`.
- **Environment variables:**  
  Injected into containers via Kubernetes manifests or Docker Compose.

---

## 🔗 Project Structure

```
.
├── backend/                    # Flask backend
├── frontend/                   # React frontend
├── k8s/                        # Kubernetes manifests
├── docker-compose.yaml         # Local Docker Compose config
├── .github/workflows/ci.yaml   # GitHub Actions workflow
└── ...
```

---

## ⚙️ CI/CD Pipeline

- **GitHub Actions**:
  - On push: builds Docker images for backend and frontend, pushes to DockerHub.
  - (Optional: deploys to Kubernetes cluster or triggers Render deployment.)

---

## 📂 Kubernetes Manifests

- **Namespace:** All resources in `cookwithlove`
- **Secrets & ConfigMaps:** For secure/env configuration
- **StatefulSet:** MongoDB with persistent storage
- **Deployments/Services:** Flask backend & React frontend
- **Ingress:** Clean URLs, routing `/api` to backend and `/` to frontend

---

## 🖼️ Demo & Screenshots

- Check running resources:
  ```sh
  kubectl get all -n cookwithlove
  kubectl get ingress -n cookwithlove
  ```
- Open the app in browser at [http://cookwithlove.local](http://cookwithlove.local) (K8s) or [http://localhost:3001](http://localhost:3001) (local).
- Deployed version: see [Render.com](https://render.com/)

---

## 👤 Authors

- [jovanoskalj](https://github.com/jovanoskalj)

---

## 📄 License

MIT
