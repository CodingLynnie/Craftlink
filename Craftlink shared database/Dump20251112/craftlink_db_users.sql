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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('buyer','seller','admin','artisan') DEFAULT 'buyer',
  `profile_image` varchar(255) DEFAULT NULL,
  `bio` text,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `min_price` decimal(10,2) DEFAULT '0.00',
  `status` varchar(20) DEFAULT 'active',
  `rent` varchar(20) DEFAULT 'unpaid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrator','admin@craftlink.co.ke','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'admin',NULL,NULL,NULL,'2025-06-28 11:09:08','2025-07-09 07:35:28',0.00,'active','unpaid'),(2,'Grace Wanjiku','grace@craftlink.co.ke','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+254700123456','seller',NULL,'Traditional jewelry artisan with 15 years experience','Nairobi, Kenya','2025-06-28 11:11:24','2025-07-09 09:39:23',500.00,'active','paid'),(3,'Sarah Johnson','sarah@example.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+1234567890','buyer',NULL,NULL,'New York, USA','2025-06-28 11:11:25','2025-06-28 11:11:25',0.00,'active','unpaid'),(4,'Viviane Wangari','wangariviviane@gmail.com','$2a$10$DC49tFDUU8sXIhwS5uTGwe/dMpvlrR09GkH7MgsR/aGn9VY.8qcp.','0741600265','buyer',NULL,NULL,NULL,'2025-06-28 14:53:48','2025-06-28 14:53:48',0.00,'active','unpaid'),(5,'Esther Wanjiru','wanjiru@gmail.com','$2a$10$iWykgcc8AAPMWitV5CnKVO.18FsIFsg7VqeIZ98e/Stl6EQpnQ0oS','0721315651','seller',NULL,NULL,NULL,'2025-06-28 15:04:31','2025-07-09 09:39:45',0.00,'active','unpaid'),(6,'peter','peet@gmail.com','$2a$10$zRMpe3ZZhG9hTKShmS6xJ.L1.G9YuICDO/gDhGZunMCD0qFwrj0f.','0722618890','buyer',NULL,NULL,NULL,'2025-06-28 18:43:08','2025-06-28 18:43:08',0.00,'active','unpaid'),(7,'Njau','njai12@gmail.com','$2a$10$5qVL7WGVOOS/35j14p2Fuen/0gX3/s1sA7AcDL5K00NTxoz8dh50u','0789110008','seller',NULL,NULL,NULL,'2025-06-28 19:44:59','2025-06-28 19:44:59',0.00,'active','unpaid'),(8,'Marilyn Kimathi','kimathi@gmail.com','$2a$10$xys3h/Gc5PzI4R6wem5oIeLD4XcnzVZCWMuENPTOwh749ojKZbz/e','0765432134','seller',NULL,NULL,NULL,'2025-06-29 10:21:18','2025-06-29 10:21:18',0.00,'active','unpaid'),(9,'Salome Kiki','kiki@gmail.com','kiki',NULL,'seller','/images/baskets.png',NULL,'Nakuru,Kenya','2025-06-29 10:29:50','2025-06-29 10:38:44',1200.00,'active','unpaid'),(10,'Peter Caleb','caleb@gmail.com','$2a$10$KcqCTPZf/RK/RBvWP94O4e7511oE7jZqOmik069cJoqO6wdLAhN1W','0789765421','seller',NULL,NULL,NULL,'2025-07-03 12:45:02','2025-07-03 12:45:02',0.00,'active','unpaid'),(11,'Victor Amani','victoramani@gmail.com','$2a$10$0TpmryELEyUInasKwZ1no.zJLw3tHMP6yOqShn6xA3GVz6Wtmt0nO','0789765432','admin',NULL,NULL,NULL,'2025-07-03 13:15:55','2025-07-08 16:00:24',0.00,'active','unpaid'),(12,'Lucy Njero','njeri@gmail.com','$2a$10$RrNgVKm5R7BMNfgYFbpcI.9kvROnWaaP32vPmNMYq8n5hoxcCDtGK','0765432189','seller',NULL,NULL,NULL,'2025-07-08 13:37:14','2025-07-08 13:37:14',0.00,'active','unpaid'),(13,'Greg Kimathi','greg@gmail.com','$2a$10$88zmIEn2Kqv1VV9PFr.6N.waGW4V1KIeouUW0u/PjMJ8jC/Xd7N7K','0786437829','seller',NULL,NULL,NULL,'2025-07-08 14:49:24','2025-07-08 14:49:24',0.00,'active','unpaid'),(14,'Alexia Mtu','alexia@gmail.com','$2a$10$oER0IJ7U28VzWhnGkeTpRuHf6kipMN7KPhX.ac2bPHLHf0jvCRM72','0765241345','buyer',NULL,NULL,NULL,'2025-07-09 07:40:04','2025-07-09 07:40:04',0.00,'active','unpaid'),(15,'Precious Kiti','precious@gmail.com','$2a$10$M35Tyn0BNKmW5h0hDyiSkuds5WnFoKe24XCS8b1d7HAfPh0eY54bO','0784624919','buyer',NULL,NULL,NULL,'2025-07-09 07:42:54','2025-07-09 07:42:54',0.00,'active','unpaid'),(16,'Riri','riri@gmail.com','$2a$10$E/q4MtP23nBdTWGUX7PqAuwXcL7unTLkbP9UUx9sUCvKqFaoMA9aG','0763512341','seller',NULL,NULL,NULL,'2025-07-09 07:44:05','2025-07-09 07:44:05',0.00,'active','unpaid'),(17,'Daniel','dan@gmail.com','$2a$10$oiuhPFrmtuKpToPtlUODRe.VMN51D8CGvijVDpr3QL7cku1E8Mcqa','0763456781','admin',NULL,NULL,NULL,'2025-07-09 07:45:06','2025-07-09 07:45:06',0.00,'active','unpaid'),(18,'Viviane Wangari Njoroge','viviane.njoroge@strathmore.edu','$2a$10$jwo75DjyFZInfI3XR8ZPoegKnSnCaEsWhUSjyYQhPuq2nTdxLy40K','0701952714','buyer',NULL,NULL,NULL,'2025-11-11 10:56:04','2025-11-11 10:56:04',0.00,'active','unpaid');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
