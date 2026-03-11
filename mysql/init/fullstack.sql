-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: fullstack
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
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `primer_nombre` varchar(100) NOT NULL,
  `segundo_nombre` varchar(100) DEFAULT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `edad_empleado` int NOT NULL,
  `telefono_empleado` varchar(10) NOT NULL,
  `correo_empleado` varchar(255) NOT NULL,
  `puesto_empleado` enum('Diseñador','Programador','Coordinador','Supervisor') DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `telefono_empleado` (`telefono_empleado`),
  UNIQUE KEY `correo_empleado` (`correo_empleado`),
  CONSTRAINT `empleado_chk_1` CHECK (regexp_like(`telefono_empleado`,_utf8mb4'^[0-9]{10}$')),
  CONSTRAINT `empleado_chk_2` CHECK ((`correo_empleado` like _utf8mb4'%_@_%._%'))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,'Luis','Alberto','Ramírez','González',22,'1234567898','luis.rg@example.com','Programador'),(2,'Armando',NULL,'Perez',NULL,52,'1234567890','a@a.com','Diseñador'),(3,'Andres',NULL,'Rodriguez',NULL,24,'8984656546','ra@ejemplo.com','Programador');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyecto`
--

DROP TABLE IF EXISTS `proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyecto` (
  `id_proyecto` int NOT NULL AUTO_INCREMENT,
  `nombre_proyecto` varchar(100) NOT NULL,
  `descripcion_proyecto` varchar(255) NOT NULL,
  `estado_proyecto` enum('Pendiente de aprobación','En proceso','En pruebas','Finalizado','Cancelado') NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  PRIMARY KEY (`id_proyecto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyecto`
--

LOCK TABLES `proyecto` WRITE;
/*!40000 ALTER TABLE `proyecto` DISABLE KEYS */;
INSERT INTO `proyecto` VALUES (2,'Sistema de Gestión Escolar','Plataforma para administrar alumnos, grupos y calificaciones.','En proceso','2025-02-01','2025-06-30'),(3,'TAREA 2','OTRA TAREA','Finalizado','2025-02-01','2025-06-30'),(4,'Prueba para proyecto','Viendo si queda el POST de proyecto','En proceso','2026-02-28','2026-02-28'),(5,'Evidencia fotografica','Proyecto para mostrar inserción de información','En proceso','2026-02-28','2026-02-28'),(7,'Video de prueba','Grabacion del video para la fase 1 de fullstack','En pruebas','2026-03-01','2026-03-01'),(8,'ACTIVIDAD 2 - DESARROLLO FULLSTACK','Evidencia para la actividad 2','En proceso','2026-03-07','2026-03-07'),(9,'GRABACION VIDEO SEMANA 3','Grabar evidencia de la tarea','En proceso','2026-03-10','2026-03-08'),(10,'GRABACION VIDEO SEMANA 3 V2','OTRA TAREA','En proceso','2026-03-08','2026-03-08'),(11,'ACTIVIDAD 2 VIDEO','Grabacion del video act2','En proceso','2026-03-08','2026-03-08'),(12,'xd','xd','Pendiente de aprobación','2026-03-09','2026-03-09');
/*!40000 ALTER TABLE `proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarea`
--

DROP TABLE IF EXISTS `tarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarea` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `nombre_tarea` varchar(100) NOT NULL,
  `descripcion_tarea` varchar(255) NOT NULL,
  `estatus_tarea` enum('Pendiente','En proceso','En pruebas','Finalizado','Solucionando errores','Cancelado') NOT NULL,
  `comentarios_tarea` varchar(255) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `id_proyecto` int NOT NULL,
  `id_empleado` int DEFAULT NULL,
  PRIMARY KEY (`id_tarea`),
  KEY `id_proyecto` (`id_proyecto`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`),
  CONSTRAINT `tarea_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea`
--

LOCK TABLES `tarea` WRITE;
/*!40000 ALTER TABLE `tarea` DISABLE KEYS */;
INSERT INTO `tarea` VALUES (16,'Captura de información','Tomar captura de pantalla a la actualización de información','En proceso','','2026-02-28','2026-02-28',5,1),(18,'Grabar video','Explicar funcionamiento de pagina y codigo','En pruebas','Ya se esta terminando la demostracion de la pagina, se procederá al funcionamiento del codigo','2026-03-01','2026-03-02',7,3),(19,'Prueba','asjdna','Pendiente','asdas','2026-03-01','2026-03-01',2,2),(20,'Preparar reporte mensual v2','Generar el reporte y enviarlo al profesor','Pendiente','Ninguno','2025-03-08','2025-03-08',10,3),(21,'Preparar video actividad v3','Generar el reporte y enviarlo al profesor','Pendiente','Ninguno','2025-03-08','2025-03-08',10,3);
/*!40000 ALTER TABLE `tarea` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-10 21:32:57
