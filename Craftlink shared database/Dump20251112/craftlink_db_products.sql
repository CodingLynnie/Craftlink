-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: craftlink_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `images` json DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,7,'beaded necklace','Brown African beads',2500.00,'jewelry','[\"/uploads/images-1751140388655-877712503.jpg\"]',56,1,'2025-06-28 19:53:08','2025-06-28 19:53:08'),(2,8,'Crochet pants','Simple and well knitted pants',2497.00,'crocheted clothes','[\"/uploads/images-1751192618615-311883175.jpg\"]',788,1,'2025-06-29 10:23:38','2025-06-29 10:23:38'),(3,10,'Pancake','Lovely pancakes',700.00,'jewelry','[\"/uploads/images-1751785558326-62059131.png\"]',5,1,'2025-07-06 07:05:58','2025-07-06 07:05:58'),(4,10,'Journal','Unwind your day in an african print journal ',2502.00,'beaded journals','[\"/uploads/images-1751821936054-905708761.jpg\"]',567,1,'2025-07-06 17:12:16','2025-07-06 17:12:16'),(5,10,'test image','test image',100.00,'jewelry','[\"/uploads/images-1751896633202-251613232.jpg\"]',5,1,'2025-07-07 13:57:13','2025-07-07 13:57:13'),(6,12,'Journals','Unwind your day in here ',4567.00,'beaded journals','[\"/uploads/images-1751981878515-741058536.jpg\"]',233,1,'2025-07-08 13:37:58','2025-07-08 13:37:58'),(7,13,'Cups','Sip some to in beautiful cups!!',3456.00,'ceramic cups','[\"/uploads/images-1751986439081-511714224.jpg\"]',77,1,'2025-07-08 14:53:59','2025-07-08 14:53:59'),(8,7,'Maa Jewelery','Cool necklace for even cooler ladies',2000.00,'jewelry','[\"/uploads/images-1751989356605-162489974.jpg\"]',5,1,'2025-07-08 15:42:36','2025-07-08 15:42:36'),(9,8,'Head jewellery','Enhance you appearance with this ',3456.00,'jewelry','[\"/uploads/images-1752045344078-599219490.jpg\"]',77,1,'2025-07-09 07:15:44','2025-07-09 07:15:44'),(10,8,'Bracelet','Look pretty',1234.00,'jewelry','[\"/uploads/images-1752046328010-326952722.jpg\"]',75,1,'2025-07-09 07:32:08','2025-07-09 07:32:08'),(11,16,'Bracelet','Beautiful hands',1235.00,'jewelry','[\"/uploads/images-1752047219598-31209938.jpg\"]',55,1,'2025-07-09 07:46:59','2025-07-09 07:46:59'),(12,16,'head jewellery','Look good in this',5789.00,'jewelry','[\"/uploads/images-1752053886807-800189680.jpg\"]',4,1,'2025-07-09 09:38:06','2025-07-09 09:38:06');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-12 16:03:49
