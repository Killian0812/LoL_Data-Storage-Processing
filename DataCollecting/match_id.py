import json
from kafka import KafkaConsumer
from kafka import KafkaProducer
import requests
from config import api_key, current_date

print(f"match_id_{current_date}")

# consumer và producer
consumer = KafkaConsumer(
    f"puuid_{current_date}",  # Tên topic
    bootstrap_servers="localhost:9092",  # Địa chỉ của Kafka broker
    enable_auto_commit=True,
    auto_commit_interval_ms=300,
    auto_offset_reset="earliest",  # Bắt đầu đọc từ đầu nếu không tìm thấy offset
    group_id=f"match_id_{current_date}",  # ID nhóm cho consumer
)

producer = KafkaProducer(bootstrap_servers="localhost:9092")

total = 0
for message in consumer:
    puuid = message.value.decode("utf-8")

    url = f"https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=5&api_key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        match_ids = response.json()
        print(match_ids)
        total += len(match_ids)
        producer.send(f"match_id_{current_date}", f"{match_ids}".encode())
        print(f"Got match ids of {puuid}. Total n.o match id: {total}")
    else:
        print(f"Error with {puuid}: Status code {response.status_code}")
        producer.send(f"puuid_{current_date}", f"{puuid}".encode())
        print(f"Reproduced {puuid}")

producer.close()
consumer.close()
