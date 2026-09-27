# CloudCart

CloudCart is a full-stack e-commerce platform built with the MERN stack and deployed on AWS using Docker, Kubernetes, Amazon EKS, Amazon RDS, Amazon ECR, GitHub Actions, and an AWS Application Load Balancer.

## Live Website

https://cloudcartindia.online/

## Project Overview

CloudCart provides an online shopping platform with separate customer, seller, and admin functionality.

### Main Features

- Customer registration and login
- Customer product browsing
- Product management
- Shopping cart
- Checkout and orders
- Seller functionality
- Admin functionality
- MySQL database
- REST API backend
- Responsive React frontend
- HTTPS-enabled production deployment

## Technology Stack

### Frontend

- React.js
- Vite
- HTML
- CSS
- JavaScript
- Nginx

### Backend

- Node.js
- Express.js
- Mongoose
- REST APIs

### Database

- MySQL
- Amazon RDS

### Cloud & DevOps

- AWS
- Amazon EKS
- Amazon ECR
- Application Load Balancer
- Route 53
- IAM
- AWS Certificate Manager
- Docker
- Kubernetes
- GitHub Actions
- GitHub OIDC
- CloudWatch
- AWS X-Ray

## Architecture

```text
                         Internet
                            |
                            v
                    Route 53 DNS
                            |
                            v
                AWS Application Load Balancer
                       HTTPS / TLS
                            |
                 +----------+----------+
                 |                     |
              Frontend               Backend
                 |                     |
                 v                     v
             EKS Pods              EKS Pods
             React/Nginx          Node/Express
                                       |
                                       v
                                  Amazon RDS
                                    MySQL
## Kubernetes

CloudCart runs on Amazon EKS.

Main Kubernetes resources include:

- Frontend Deployment
- Backend Deployment
- Frontend Service
- Backend Service
- Horizontal Pod Autoscaler
- Pod Disruption Budget
- AWS Load Balancer Controller
- ALB Ingress
- Kubernetes Secrets
- Kubernetes resource limits

The backend uses multiple replicas and an HPA for CPU-based scaling.

## Docker

The application is containerized using Docker.

Separate images are created for:

- Frontend
- Backend

Images are stored in Amazon ECR and deployed to Amazon EKS.

## CI/CD Pipeline

CloudCart uses GitHub Actions for automated CI/CD.

### CI Pipeline

On every push or pull request to `main`:

1. Checkout source code
2. Setup Node.js
3. Install backend dependencies
4. Check backend syntax
5. Install frontend dependencies
6. Build frontend

### CD Pipeline

On every push to `main`:

1. Checkout source code
2. Authenticate with AWS using GitHub OIDC
3. Login to Amazon ECR
4. Build backend Docker image
5. Push backend image to ECR
6. Build frontend Docker image
7. Push frontend image to ECR
8. Configure kubectl for Amazon EKS
9. Update backend deployment
10. Update frontend deployment
11. Wait for Kubernetes rollouts to complete

This provides automatic deployment from GitHub to AWS.

## Security

The deployment includes:

- GitHub OIDC authentication
- IAM roles
- ECR image immutability
- ECR lifecycle policies
- HTTPS using AWS Certificate Manager
- Private Amazon RDS database access
- Kubernetes Secrets
- Kubernetes resource limits
- Pod Disruption Budgets
- Horizontal Pod Autoscaling

## SEO

CloudCart includes basic search-engine optimization:

- SEO title
- Meta description
- Open Graph metadata
- XML sitemap
- robots.txt
- Google Search Console verification
- Google indexing

Sitemap:

https://cloudcartindia.online/sitemap.xml

## Production Verification

The production deployment has been verified for:

- Frontend availability
- Backend API availability
- MySQL database connectivity
- HTTPS
- Route 53 DNS
- Kubernetes pod health
- Backend horizontal scaling
- Docker image deployment
- GitHub Actions CI
- GitHub Actions CD
- Google Search Console indexing

## Author

Vineeth P Mural

## License

This project is intended for educational and portfolio purposes.
