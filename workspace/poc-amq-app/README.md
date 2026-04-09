# AMQ Demo App

This AMQ demo app is a simple proof-of-concept for sending and receiving messages using an ActiveMQ (AMQ) instance. It is designed to be configurable and ready for deployment in OpenShift.

## Requirements
- Python 3.10+
- Docker (for containerization)
- Access to an AMQ broker instance

## Installation and Setup

### Local Setup
1. Clone or download the `poc-amq-app` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables:
   ```bash
   export AMQ_BROKER_URL=amqp://<user>:<password>@<broker-url>:5672/
   export AMQ_QUEUE=test-queue
   export AMQ_MESSAGE="Hello, AMQ!"
   export CONSUMER_ENABLED=true
   ```
   Replace `<user>`, `<password>`, and `<broker-url>` with your credentials and broker details.
4. Run the application:
   ```bash
   python app.py
   ```

### Docker Setup
1. Build the Docker image:
   ```bash
   docker build -t amq-demo-app .
   ```
2. Run the Docker container:
   ```bash
   docker run -e AMQ_BROKER_URL=amqp://<user>:<password>@<broker-url>:5672/ \
              -e AMQ_QUEUE=test-queue \
              -e AMQ_MESSAGE="Hello, AMQ!" \
              -e CONSUMER_ENABLED=true \
              amq-demo-app
   ```

### OpenShift Deployment
1. Push the Docker image to your container registry (e.g., Docker Hub, Quay.io).
2. Create a new application in OpenShift using the image.
3. Configure environment variables in the OpenShift console or deployment config:
   - `AMQ_BROKER_URL`
   - `AMQ_QUEUE`
   - `AMQ_MESSAGE`
   - `CONSUMER_ENABLED`
4. Deploy the application.

## Configuration
The app is fully configurable using the following environment variables:

| Variable           | Description                                  | Default Value                |
|--------------------|----------------------------------------------|------------------------------|
| `AMQ_BROKER_URL`   | Connection string for the AMQ broker         | `amqp://guest:guest@localhost:5672/` |
| `AMQ_QUEUE`        | Name of the queue to produce/consume messages | `default-queue`              |
| `AMQ_MESSAGE`      | Message content to send                     | `Hello, AMQ!`                |
| `CONSUMER_ENABLED` | Enable/disable the consumer function         | `true`                       |

## Functionality

1. **Producer**: Sends a message to the configured queue.
2. **Consumer**: Subscribes to the queue and processes incoming messages. Messages are printed to the console.

## Example

### Producer Output
```
Connecting to broker: amqp://guest:guest@localhost:5672/
Queue: test-queue
Message sent to test-queue: Hello, AMQ!
```

### Consumer Output
```
Connecting to broker: amqp://guest:guest@localhost:5672/
Queue: test-queue
Waiting for messages on test-queue. To exit press CTRL+C
Received: Hello, AMQ!
```