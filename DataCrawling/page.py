from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers="localhost:9092")

start_page = 1
end_page = 2
for number in range(start_page, end_page):  # 100 người / trang
    producer.send("page", str(number).encode())
    producer.flush()

print(f"Produced {end_page-start_page} pages")
