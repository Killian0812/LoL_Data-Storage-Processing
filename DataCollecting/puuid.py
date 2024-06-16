from kafka import KafkaConsumer
from kafka import KafkaProducer
import requests
from config import api_key, current_date

print(f"puuid_{current_date}")

# Tạo Kafka consumer
consumer = KafkaConsumer(
    f"riot_id_{current_date}",  # Tên topic
    bootstrap_servers='localhost:9092',  # Địa chỉ của Kafka broker
    enable_auto_commit=True,
    auto_commit_interval_ms=300,
    auto_offset_reset='earliest',  # Bắt đầu đọc từ đầu nếu không tìm thấy offset
    group_id=f'puuid_{current_date}'  # ID nhóm cho consumer
)

producer = KafkaProducer(bootstrap_servers='localhost:9092')

total = 0
api_key_index = 0
# Xử lý mỗi message từ consumer
for message in consumer:
    # Decode message từ binary thành chuỗi
    riot_id = message.value.decode('utf-8')
    riot_name, riot_tagline = riot_id.rsplit("#", 1)
    print(f"Riot Name: {riot_name}, Riot Tagline: {riot_tagline}")

    url = f"https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{riot_name}/{riot_tagline}?api_key={api_key[api_key_index]}"
    response = requests.get(url)
    if response.status_code == 200:
        summoner_data = response.json()

        # Lấy trường puuid
        puuid = summoner_data.get('puuid', '')
        producer.send(f'puuid_{current_date}', f'{puuid}'.encode())
        producer.flush()
        total += 1
        print(f"Got puuid of {riot_name}. Total: {total}")

    else:
        print(f"Error with {riot_name}, {riot_tagline}: Status code {response.status_code}")
        producer.send(f"riot_id_{current_date}", f"{riot_id}".encode())
        print(f"Reproduced {riot_name}")
        if response.status_code == 429:
            api_key_index = (api_key_index + 1) % 2
        
# Đừng quên close consumer khi không còn sử dụng
consumer.close()
producer.close()