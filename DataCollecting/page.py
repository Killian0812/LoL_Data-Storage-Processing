from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers="localhost:9092")

start_page = 15
end_page = 20
for number in range(start_page, end_page + 1):  # 100 người / trang
    producer.send("page", str(number).encode())
    producer.flush()

print(f"Produced {end_page - start_page + 1} pages")
