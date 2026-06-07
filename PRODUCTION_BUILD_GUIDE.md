# FlowCore - Production Build & Release Guide

## Production Release Checklist

### Pre-Release Tasks

- [x] Code review completed
- [x] All features implemented
- [x] Unit tests passed
- [x] E2E tests completed
- [x] Security review done
- [x] Performance optimization completed
- [x] Database migrations tested
- [ ] Documentation finalized
- [ ] Release notes prepared
- [ ] Deployment plan reviewed

## Building for Production

### Backend Build

#### Step 1: Clean Previous Build
```bash
cd flowcore-backend
mvn clean
```

#### Step 2: Run Tests (Optional - Add Tests)
```bash
mvn test
```

#### Step 3: Build Production JAR
```bash
mvn package -P production -DskipTests=true
```

Output: `target/flowcore-backend-1.0.0.jar` (52.5 MB)

#### Step 4: Verify JAR
```bash
java -jar target/flowcore-backend-1.0.0.jar --version
```

### Frontend Build

#### Step 1: Install Dependencies
```bash
cd flowcore-frontend
npm install
```

#### Step 2: Run Tests (Optional - Add Tests)
```bash
npm run test
```

#### Step 3: Build for Production
```bash
npm run build
```

Output: `dist/` directory with optimized files

#### Step 4: Analyze Build Size
```bash
npm run build -- --report
```

### Docker Containerization

#### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim as builder
WORKDIR /app
COPY flowcore-backend .
RUN mvn clean package -DskipTests -q

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/flowcore-backend-1.0.0.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher \
    || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Build Docker Image
```bash
docker build -t flowcore-backend:1.0.0 -f Dockerfile.backend .
docker tag flowcore-backend:1.0.0 flowcore-backend:latest
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY flowcore-frontend .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build Docker Images
```bash
docker build -t flowcore-frontend:1.0.0 -f Dockerfile.frontend .
docker tag flowcore-frontend:1.0.0 flowcore-frontend:latest
```

### Docker Compose for Local Testing

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: flowcore_db
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/flowcore_db?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:8080

volumes:
  mysql_data:
```

#### Run with Docker Compose
```bash
docker-compose up -d
```

## Deployment Environments

### 1. Development Environment
- **URL**: http://localhost:5173
- **API**: http://localhost:8080
- **Database**: localhost:3307
- **Auto-reload**: Enabled

### 2. Staging Environment
- **URL**: https://staging.flowcore.io
- **API**: https://api-staging.flowcore.io
- **Database**: AWS RDS MySQL
- **SSL**: Enabled
- **Backups**: Daily

### 3. Production Environment
- **URL**: https://flowcore.io
- **API**: https://api.flowcore.io
- **Database**: AWS RDS MySQL (Multi-AZ)
- **SSL**: Enabled + HSTS
- **CDN**: CloudFront
- **Backups**: Hourly
- **Monitoring**: CloudWatch + DataDog

## Cloud Deployment Options

### Option A: AWS Deployment

#### Backend on EC2/ECS
```bash
# Create ECR repository
aws ecr create-repository --repository-name flowcore-backend

# Push image
docker tag flowcore-backend:1.0.0 $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/flowcore-backend:1.0.0
docker push $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/flowcore-backend:1.0.0

# Deploy to ECS with ALB
# Create task definition, service, load balancer
```

#### Frontend on S3 + CloudFront
```bash
# Build frontend
npm run build

# Sync to S3
aws s3 sync dist/ s3://flowcore-app/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

#### Database on RDS
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier flowcore-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password $DB_PASSWORD
```

### Option B: Heroku Deployment

#### Backend
```bash
# Create Heroku app
heroku create flowcore-backend

# Add MySQL addon
heroku addons:create cleardb:ignite -a flowcore-backend

# Deploy
git push heroku main
```

#### Frontend
```bash
# Create Vite configuration for Heroku
npm run build
heroku create flowcore-frontend
git push heroku main
```

### Option C: Azure Deployment

#### Backend on App Service
```bash
# Create resource group
az group create -n flowcore-rg -l eastus

# Create App Service plan
az appservice plan create -n flowcore-plan -g flowcore-rg

# Create Web App
az webapp create -n flowcore-backend -p flowcore-plan -g flowcore-rg

# Deploy JAR
az webapp up --runtime java17 --os windows
```

#### Frontend on Static Web Apps
```bash
# Create Static Web App
az staticwebapp create \
  --name flowcore-frontend \
  --resource-group flowcore-rg \
  --source https://github.com/username/flowcore

# Deploy
npm run build
npm ci --production
az staticwebapp upload -name flowcore-frontend --source ./dist
```

## Post-Deployment Verification

### Health Checks
```bash
# Backend health
curl https://api.flowcore.io/api/health

# Frontend loading
curl https://flowcore.io | grep "<title>"
```

### Database Verification
```bash
# Check connection
mysql -u admin -p$DB_PASSWORD -h flowcore-db.abc123.us-east-1.rds.amazonaws.com

# Verify tables
USE flowcore_db;
SHOW TABLES;
```

### API Testing
```bash
# Test authentication
curl -X POST https://api.flowcore.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test workers endpoint
curl -X GET https://api.flowcore.io/api/workers \
  -H "Authorization: Bearer $TOKEN"
```

## Monitoring & Logging

### Backend Monitoring
- **Application**: New Relic / DataDog
- **Performance**: APM metrics
- **Errors**: Sentry / Rollbar
- **Logs**: CloudWatch / ELK Stack

Example New Relic Setup:
```properties
newrelic.app_name=FlowCore Backend
newrelic.license_key=$NEW_RELIC_LICENSE_KEY
```

### Frontend Monitoring
- **Errors**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Lighthouse CI
- **Logs**: LogRocket

Example Sentry Setup:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

## Security in Production

### HTTPS/SSL
- Auto-renew SSL certificates using Let's Encrypt
- Enforce HTTPS redirect
- Add HSTS header

### Environment Variables
```bash
export DB_PASSWORD=$SECURE_DB_PASSWORD
export JWT_SECRET=$SECURE_JWT_SECRET
export API_KEY=$SECURE_API_KEY
```

### Database Security
- Enable encryption at rest
- Enable encryption in transit
- Regular backups
- Access via VPC only

### API Security
- Rate limiting: 1000 requests/hour
- CORS: Restricted domains only
- CSRF protection enabled
- Input validation on all endpoints

### Secrets Management
```bash
# Using AWS Secrets Manager
aws secretsmanager create-secret \
  --name flowcore/db-password \
  --secret-string $DB_PASSWORD
```

## Rollback Plan

### If Deployment Fails
```bash
# Keep previous version running
# Test new deployment in staging first
# Use blue-green deployment strategy
# Keep previous images available
```

### Automatic Rollback
```bash
# Health check fails → automatic rollback
# Error rate > 5% → automatic rollback
# Response time > 1s → alert only
```

## Release Notes Template

```
# FlowCore v1.0.0 - Release Notes

## New Features
- Worker management system
- Site/project tracking
- Attendance marking
- Salary calculations
- User authentication with JWT

## Improvements
- Responsive UI design
- Database optimization
- API performance tuning

## Bug Fixes
- Fixed [issue description]
- Fixed [issue description]

## Breaking Changes
- None

## Dependencies Updated
- Spring Boot: 3.3.5
- React: 18.2.0
- MySQL: 8.0

## Installation/Upgrade
[Instructions]

## Known Issues
- [List any known issues]

## Support
- Email: support@flowcore.io
- Docs: https://docs.flowcore.io
```

## Version Control

### Tagging Release
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Version Bumping
```bash
# Backend: Update pom.xml version
# Frontend: Update package.json version
# Create Release branch: release/v1.0.0
```

## Performance Benchmarks (Target)

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms | TBD |
| Page Load Time | < 2s | TBD |
| Database Query | < 100ms | TBD |
| Uptime | 99.9% | TBD |

## Maintenance Windows

- **Weekly**: Database optimization (Tuesday 2-3 AM UTC)
- **Monthly**: Security patches (First Sunday 1-2 AM UTC)
- **Quarterly**: Major updates (As needed)

---

**Version**: 1.0.0
**Release Date**: May 22, 2026
**Status**: Ready for Production ✅
