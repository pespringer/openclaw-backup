import os
import pika

# Load configuration from environment variables
AMQ_BROKER_URL = os.getenv("AMQ_BROKER_URL", "amqp://guest:guest@localhost:5672/")
AMQ_QUEUE = os.getenv("AMQ_QUEUE", "default-queue")
AMQ_MESSAGE = os.getenv("AMQ_MESSAGE", "Hello, AMQ!")
CONSUMER_ENABLED = os.getenv("CONSUMER_ENABLED", "true").lower() == "true"

# Setup connection
def setup_connection():
    parameters = pika.URLParameters(AMQ_BROKER_URL)
    return pika.BlockingConnection(parameters)

def publish_message():
    connection = setup_connection()
    channel = connection.channel()
    channel.queue_declare(queue=AMQ_QUEUE)
    channel.basic_publish(exchange="", routing_key=AMQ_QUEUE, body=AMQ_MESSAGE)
    print(f"Message sent to {AMQ_QUEUE}: {AMQ_MESSAGE}")
    connection.close()

def consume_messages():
    def callback(ch, method, properties, body):
        print(f"Received: {body.decode()}")

    connection = setup_connection()
    channel = connection.channel()
    channel.queue_declare(queue=AMQ_QUEUE)
    channel.basic_consume(queue=AMQ_QUEUE, on_message_callback=callback, auto_ack=True)
    print(f"Waiting for messages on {AMQ_QUEUE}. To exit press CTRL+C")
    channel.start_consuming()

if __name__ == "__main__":
    print(f"Connecting to broker: {AMQ_BROKER_URL}")
    print(f"Queue: {AMQ_QUEUE}")

    publish_message()
    if CONSUMER_ENABLED:
        consume_messages()
