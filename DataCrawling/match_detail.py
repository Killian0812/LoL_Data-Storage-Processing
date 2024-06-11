import json
from kafka import KafkaConsumer
from kafka import KafkaProducer
import requests
from config import api_key, current_date

print(f"match_detail_{current_date}")

# consumer và producer
consumer = KafkaConsumer(
    f"match_id_{current_date}",  # Tên topic
    bootstrap_servers="localhost:9092",  # Địa chỉ của Kafka broker
    enable_auto_commit=True,
    auto_commit_interval_ms=300,
    auto_offset_reset="earliest",  # Bắt đầu đọc từ đầu nếu không tìm thấy offset
    group_id=f"match_detail_{current_date}",  # ID nhóm cho consumer
    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    ),  # Deserializer cho dữ liệu JSON
)

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

total = 0
for message in consumer:
    match_ids = message.value
    for match_id in match_ids:
        url = f"https://sea.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            match_detail = response.json()
            total += 1
            producer.send(f"match_detail_{current_date}", match_detail)
            print(f"Got match detail of {match_id}. Total n.o match detail: {total}")
        else:
            print(f"Error with {match_id}: Status code {response.status_code}")
            producer.send(f"match_id_{current_date}", [match_id])
            print(f"Reproduced {match_id}")

producer.close()
consumer.close()
