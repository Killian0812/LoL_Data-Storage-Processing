import json
import ast
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
)

producer = KafkaProducer(bootstrap_servers="localhost:9092")
producerWithSerializer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

total = 0
for message in consumer:
    match_ids = ast.literal_eval(message.value.decode("utf-8"))
    print(match_ids)

    for match_id in match_ids:
        url = f"https://sea.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            match_detail = response.json()
            total += 1
            producerWithSerializer.send(f"match_detail_{current_date}", match_detail)
            print(f"Got match detail of {match_id}. Total n.o match detail: {total}")
        else:
            print(f"Error with {match_id}: Status code {response.status_code}")
            err_ids = [match_id]
            producer.send(f"match_id_{current_date}", f"{err_ids}".encode())
            print(f"Reproduced {match_id}")

producer.close()
consumer.close()
