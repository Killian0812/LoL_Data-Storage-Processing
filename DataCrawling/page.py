from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers='localhost:9092')

for number in range(1, 2): # 100 người / trang
    producer.send('page', str(number).encode())
    producer.flush()
