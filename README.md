# Data collecting
Cài đặt Kafka: https://www.conduktor.io/kafka/how-to-start-kafka-using-docker/

1. page.py\
Đẩy vào queue các trang muốn crawl\
Topic: page

2. riot_id.py\
Crawl riot_id từ op.gg theo từng trang\
Topic: riot_id_yyyy_mm_dd

3. puuid.py\
Crawl puuid từ riot api theo từng riot_id\
Topic: uuid_yyyy_mm_dd

4. match_id.py\
Crawl 5 match_id từ riot api theo từng uuid\
Topic: match_id_yyyy_mm_dd

5. match_detail.py\
Crawl match_detail từ riot api theo từng match_id\
Topic: match_detail_yyyy_mm_dd

6. push_data.py\
Đẩy match_detail lên mongodb cloud


# Data processing
PySpark, Spark SQL


# Data visualization
React, NodeJS\
Embedded Atlas Search, Charts

