from kafka import KafkaConsumer
from kafka import KafkaProducer
import requests
from bs4 import BeautifulSoup
from config import current_date

print(f"riot_id_{current_date}")

# Tạo một Kafka consumer và producer
consumer = KafkaConsumer(
    "page",  # Tên của topic
    bootstrap_servers="localhost:9092",  # Địa chỉ của Kafka broker
    enable_auto_commit=True,
    auto_commit_interval_ms=300,
    auto_offset_reset="earliest",  # Bắt đầu đọc từ đầu của topic
    group_id=f"riot_id_{current_date}",  # ID nhóm cho consumer, giúp Kafka theo dõi offset của mỗi nhóm
)

producer = KafkaProducer(bootstrap_servers="localhost:9092")

# GET request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.07.3",
    "Accept-Charset": "UTF-8",
}
base_url = "https://www.op.gg/leaderboards/tier?page="


def scrape_page(page_number):
    # URL
    url = f"{base_url}{page_number}"
    print(f"Scraping {url}")
    r = requests.get(url, headers=headers)  # lấy HTML page
    if r.status_code == 200:
        soup = BeautifulSoup(r.content, "html.parser")
        content_container = soup.find(
            "div", id="content-container", class_="css-1mw8x2 esk32cx0"
        )
        table_container = content_container.find("div", class_="css-1v7j0iq e3xcvm52")
        table = table_container.find("table", class_="css-1l95r9q e1kpg1m611")
        if table:
            rows = table.find("tbody").find_all("tr")

            for row in rows:
                cells = row.find_all("td")
                summoner = cells[1].get_text(strip=True)
                # Gửi data
                producer.send(f"riot_id_{current_date}", f"{summoner}".encode())
                producer.flush()
                print(f"Got {summoner}")
            print(f"Done crawling page {page_number}")
        else:
            print(f"No data in page {page_number}")
    else:
        print(f"Error in page {page_number}: Status code {r.status_code}")


for message in consumer:
    # Decode message từ binary thành chuỗi
    page_number = message.value.decode("utf-8")
    print(page_number)
    scrape_page(page_number=page_number)

consumer.close()
producer.close()
