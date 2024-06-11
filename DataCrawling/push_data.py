import pymongo
from kafka import KafkaConsumer
import json
from config import current_date

client = pymongo.MongoClient(
    "mongodb+srv://killian0812:KfEXux78H4e5F5FG@killiancluster.1sfdevm.mongodb.net/?retryWrites=true&w=majority"
)

# Chọn hoặc tạo database
mydb = client["LOL_data"]

# Chọn hoặc tạo collection
mycol = mydb["test"]

consumer = KafkaConsumer(
    f"match_detail_{current_date}",  # Tên topic
    bootstrap_servers="localhost:9092",  # Địa chỉ của Kafka broker
    enable_auto_commit=True,
    auto_commit_interval_ms=300,
    auto_offset_reset="earliest",  # Bắt đầu đọc từ đầu nếu không tìm thấy offset
    group_id=f"insert_to_db_{current_date}",  # ID nhóm cho consumer
    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    ),  # Deserializer cho dữ liệu JSON
)

# Đẩy dữ liệu lên collection
total = 0
for message in consumer:
    match_detail = message.value
    mycol.insert_one(match_detail)
    total += 1
    print(f"Data pushed to MongoDB. Total: {total}")
