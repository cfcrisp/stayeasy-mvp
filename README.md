# StayEasy MVP

StayEasy is a lightweight, mobile-first web app that helps small home service businesses turn one-time clients into repeat customers through automated text follow-ups.

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- Twilio account (for SMS functionality)

### Environment Variables

Create a `.env` file in the `backend` directory with the following content:
DATABASE_URL=postgres://user:password@db:5432/stayeasy
JWT_SECRET=your_jwt_secret
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone


Replace `your_jwt_secret` with a secure random string, and fill in your Twilio credentials.

### Running the Application

1. Clone the repository --> cd stayeasy-mvp

2. Start the application using Docker Compose: docker-compose up --build

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment to AWS EC2

    1. Launch an EC2 instance (t2.micro) with Ubuntu Server 20.04 LTS.

    2. Install Docker and Docker Compose on the EC2 instance:
        sudo apt update
        sudo apt install docker.io docker-compose
        sudo usermod -aG docker ${USER}

    3. Clone the repository on the EC2 instance.

    4. Set up environment variables as described in the Setup Instructions.

    5. Run the application:
        docker-compose up -d

    
    6. Configure security groups to allow inbound traffic on ports 80 (HTTP) and 443 (HTTPS).

    7. Set up a domain name and configure SSL using Let's Encrypt for HTTPS.

## Additional Notes

- The application uses a free-tier PostgreSQL database. For production, consider using Amazon RDS.
- Implement proper logging and monitoring for production use.
- Regularly backup the database and implement a disaster recovery plan.
- Scale the application as needed by adjusting EC2 instance types and implementing load balancing.
