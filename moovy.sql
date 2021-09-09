-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2021 at 10:31 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moovy`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id_account` int(11) NOT NULL,
  `ruolo` enum('Cliente','Amministratore','Autista','Addetto') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cognome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_di_nascita` date NOT NULL,
  `num_telefono` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id_account`, `ruolo`, `nome`, `cognome`, `data_di_nascita`, `num_telefono`, `password`, `email`) VALUES
(1, 'Amministratore', 'Mario', 'Rossi', '1992-07-15', '3281234567', '6964f527f011df8756f87c3e8a76884f', 'amministratore@mail.it'),
(2, 'Addetto', 'Giuseppe', 'Verdi', '1994-07-01', '3771234567', '6964f527f011df8756f87c3e8a76884f', 'addetto2@mail.it'),
(3, 'Addetto', 'Francesco', 'Neri', '1997-04-03', '3213216547', '6964f527f011df8756f87c3e8a76884f', 'addetto3@mail.it'),
(4, 'Cliente', 'Luisa', 'Gialli', '2001-10-25', '3681234567', '6964f527f011df8756f87c3e8a76884f', 'cliente@mail.it'),
(5, 'Autista', 'Guido', 'Marroni', '1992-09-15', '3331234657', '6964f527f011df8756f87c3e8a76884f', 'autista@mail.it'),
(6, 'Cliente', 'Gino', 'Fiori', '1993-12-08', '3321234657', '6964f527f011df8756f87c3e8a76884f', 'gino@mail.it'),
(7, 'Addetto', 'Mario', 'Bianchi', '1997-02-10', '3407654185', '6964f527f011df8756f87c3e8a76884f', 'addetto7@mail.it'),
(8, 'Addetto', 'Maria', 'Bronte', '1997-03-10', '3407554185', '6964f527f011df8756f87c3e8a76884f', 'addetto8@mail.it'),
(10, 'Cliente', 'Merina', 'Jestin', '2000-07-03', '98876543246', '6964f527f011df8756f87c3e8a76884f', 'merina@mail.it'),
(14, 'Cliente', 'Irene', 'Pellicane', '1999-09-09', '9836627298', '6964f527f011df8756f87c3e8a76884f', 'irene@mail.it');

-- --------------------------------------------------------

--
-- Table structure for table `carte_di_credito`
--

CREATE TABLE `carte_di_credito` (
  `numero_carta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_account` int(11) NOT NULL,
  `nome_intestatario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cognome_intestatario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scadenza_carta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cvv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carte_di_credito`
--

INSERT INTO `carte_di_credito` (`numero_carta`, `ref_account`, `nome_intestatario`, `cognome_intestatario`, `scadenza_carta`, `cvv`) VALUES
('carta prova', 1, 'Admin', 'Admin', '02/30', 0),
('8600123456791231', 4, 'Luisa', 'Gialli', '07/24', 123),
('5243678902635432', 10, 'Merina', 'Jestin', '09/2027', 654),
('0000000000000000', 14, '', '', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `parcheggi`
--

CREATE TABLE `parcheggi` (
  `id_parcheggio` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `indirizzo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_addetto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parcheggi`
--

INSERT INTO `parcheggi` (`id_parcheggio`, `indirizzo`, `ref_addetto`) VALUES
('Parcheggio Basile', 'Via Ernesto Basile 110', 2),
('Parcheggio Calatafimi', 'Corso Calatafimi 9', 3),
('Parcheggio Oreto', 'Via Oreto 20', 7),
('Parcheggio Roma', 'Via Roma 97', 8);

-- --------------------------------------------------------

--
-- Table structure for table `patenti`
--

CREATE TABLE `patenti` (
  `codice_patente` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scadenza_patente` date NOT NULL,
  `tipo_a` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_b` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_am` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_a1` tinyint(1) NOT NULL DEFAULT 0,
  `tipo_a2` tinyint(1) NOT NULL DEFAULT 0,
  `ref_account` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patenti`
--

INSERT INTO `patenti` (`codice_patente`, `scadenza_patente`, `tipo_a`, `tipo_b`, `tipo_am`, `tipo_a1`, `tipo_a2`, `ref_account`) VALUES
('023944', '2023-03-01', 1, 1, 1, 1, 1, 4),
('014643', '2025-01-01', 0, 1, 1, 0, 0, 6),
('UI7483920P', '2020-09-05', 0, 1, 0, 0, 0, 10),
('000000', '0000-00-00', 0, 0, 0, 0, 0, 14);

-- --------------------------------------------------------

--
-- Table structure for table `prenotazioni`
--

CREATE TABLE `prenotazioni` (
  `id_prenotazione` int(11) NOT NULL,
  `ref_cliente` int(11) NOT NULL,
  `ref_autista` int(11) DEFAULT NULL,
  `tipo_veicolo` enum('Automobile','Moto','Bicicletta','Monopattino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_veicolo` int(11) NOT NULL,
  `mancia` float DEFAULT NULL,
  `ref_carta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stato_prenotazione` enum('Pagato','Non pagato','Veicolo Ritirato','Veicolo Riconsegnato','Annullato','Rimborsato') COLLATE utf8mb4_unicode_ci NOT NULL,
  `stato_autista` enum('Da confermare','Confermato') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_ritiro` datetime NOT NULL,
  `data_riconsegna` datetime NOT NULL,
  `luogo_ritiro` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `luogo_riconsegna` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prezzo_stimato` float NOT NULL,
  `prezzo_finale` float NOT NULL,
  `motivo_ritardo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prenotazioni`
--

INSERT INTO `prenotazioni` (`id_prenotazione`, `ref_cliente`, `ref_autista`, `tipo_veicolo`, `ref_veicolo`, `mancia`, `ref_carta`, `stato_prenotazione`, `stato_autista`, `data_ritiro`, `data_riconsegna`, `luogo_ritiro`, `luogo_riconsegna`, `prezzo_stimato`, `prezzo_finale`, `motivo_ritardo`) VALUES
(1, 10, NULL, 'Bicicletta', 652964, NULL, '5243678902635432', 'Rimborsato', NULL, '2021-09-10 00:47:00', '2021-09-12 20:47:00', 'Parcheggio Oreto', 'Parcheggio Roma', 88, 136, NULL),
(2, 10, NULL, 'Automobile', 283649, 10, 'carta prova', 'Non pagato', 'Da confermare', '2021-09-10 12:00:00', '2021-09-11 13:00:00', '', '', 12.51, 22.51, NULL),
(3, 10, NULL, 'Automobile', 283649, 10, 'carta prova', 'Non pagato', 'Da confermare', '2021-09-10 12:00:00', '2021-09-11 13:00:00', '', '', 0, 10, NULL),
(4, 10, NULL, 'Automobile', 283649, 10, 'carta prova', 'Non pagato', 'Da confermare', '2021-09-10 12:00:00', '2021-09-11 13:00:00', '', '', 0, 10, NULL),
(5, 10, NULL, 'Automobile', 172946, NULL, '5243678902635432', 'Rimborsato', NULL, '2021-09-10 23:09:00', '2021-09-11 13:09:00', 'Parcheggio Oreto', 'Parcheggio Basile', 56, 56, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('erNWYtEQdJ2KXqq7dtIm2aMYrGp8Jp7L', 1631301406, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"utente\":[{\"id_account\":10,\"ruolo\":\"Cliente\",\"nome\":\"Merina\",\"cognome\":\"Jestin\",\"data_di_nascita\":\"2000-07-02T22:00:00.000Z\",\"num_telefono\":\"98876543246\",\"password\":\"6964f527f011df8756f87c3e8a76884f\",\"email\":\"merina@mail.it\",\"numero_carta\":\"5243678902635432\",\"ref_account\":10,\"nome_intestatario\":\"Merina\",\"cognome_intestatario\":\"Jestin\",\"scadenza_carta\":\"09/2027\",\"cvv\":654,\"codice_patente\":\"UI7483920P\",\"scadenza_patente\":\"2020-09-04T22:00:00.000Z\",\"tipo_a\":0,\"tipo_b\":1,\"tipo_am\":0,\"tipo_a1\":0,\"tipo_a2\":0}],\"prenotazione\":{\"tipo_veicolo\":\"Automobile\",\"autista\":\"null\",\"luogo_partenza\":\"\",\"luogo_arrivo\":\"\",\"luogo_ritiro\":\"Parcheggio Oreto\",\"luogo_riconsegna\":\"Parcheggio Basile\",\"data_ritiro\":\"2021-09-10 23:09:00\",\"data_riconsegna\":\"2021-09-11 13:09:00\",\"modello_auto\":\"Utilitaria\",\"ref_veicolo\":\"172946\",\"patente_richiesta\":\"tipo_b\",\"prezzo_stimato\":\"56\",\"id\":5,\"prezzo_totale\":\"56\",\"stato_autista\":null,\"ref_carta\":\"5243678902635432\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `veicoli`
--

CREATE TABLE `veicoli` (
  `id_veicolo` int(11) NOT NULL,
  `nome_veicolo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_veicolo` enum('Automobile','Moto','Bicicletta','Monopattino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `modello_auto` enum('Suv','Utilitaria','Berlina') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modello_moto` enum('Ciclomotore - 50cc','Scooter - 125cc','Turistica - 600cc','Adventure - 1200cc') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patente_richiesta` enum('tipo_a','tipo_b','tipo_am','tipo_a1','tipo_a2','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `stato_veicolo` enum('Ritirato','Riconsegnato') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_parcheggio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `posizione` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tariffa` float NOT NULL,
  `descrizione` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `immagine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `veicoli`
--

INSERT INTO `veicoli` (`id_veicolo`, `nome_veicolo`, `tipo_veicolo`, `modello_auto`, `modello_moto`, `patente_richiesta`, `stato_veicolo`, `ref_parcheggio`, `posizione`, `tariffa`, `descrizione`, `immagine`) VALUES
(109364, 'Vespa Primavera', 'Moto', NULL, 'Ciclomotore - 50cc', 'tipo_am', NULL, 'Parcheggio Oreto', '', 3, 'Ciclomotore da 50cc-Patente richiesta: AM-Carburante: Benzina', '/images/Vespa-Primavera.jpg'),
(156780, 'BMW Serie 3', 'Automobile', 'Berlina', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 4, 'Berlina 5 porte-Cambio Manuale-Carburante: Benzina', '/images/bmw-serie-3.jpg'),
(172946, 'Citroen C3', 'Automobile', 'Utilitaria', NULL, 'tipo_b', NULL, 'Parcheggio Oreto', '', 4, 'Utilitaria 5 porte-Cambio Manuale-Carburante: Benzina', '/images/C3.jpg'),
(174026, 'Nissan Qashqai', 'Automobile', 'Suv', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 6, 'Suv 5 porte-Cambio Manuale-Carburante: Benzina', '/images/Nissan-Qashqai.jpg'),
(198730, 'Xiaomi', 'Monopattino', NULL, NULL, 'no', NULL, 'Parcheggio Calatafimi', '', 2, 'Monopattino elettrico', '/images/xiaomi.jpg'),
(201936, 'Audi A4', 'Automobile', 'Berlina', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 4, 'Berlina 5 porte-Cambio Manuale-Carburante: Benzina', '/images/Audi-A4.jpg'),
(203847, 'Honda Sh 125i', 'Moto', NULL, 'Scooter - 125cc', 'tipo_a1', NULL, 'Parcheggio Calatafimi', '', 4, 'Scooter da 125cc-Patente richiesta: A1-Carburante: Benzina', '/images/honda-sh-125i.jpg'),
(283649, 'Fiat 500', 'Automobile', 'Utilitaria', NULL, 'tipo_b', NULL, 'Parcheggio Oreto', '', 5, 'Utilitaria 5 porte-Cambio Manuale-Carburante: Benzina', '/images/fiat-500.jpg'),
(288634, 'Ducati Multistrada V4', 'Moto', NULL, 'Adventure - 1200cc', 'tipo_a', NULL, 'Parcheggio Roma', '', 5, 'Moto Adventure da 1200cc-Patente richiesta: A-Carburante: Benzina', '/images/Ducati-Multistrada.jpg'),
(302750, 'Yamaha Tracer 900', 'Moto', NULL, 'Turistica - 600cc', 'tipo_a2', NULL, 'Parcheggio Roma', '', 6, 'Moto Turistica da 600cc-Patente richiesta: A2-Carburante: Benzina', '/images/Yamaha-Tracer-900.jpg'),
(302864, 'Suzuki VStrom 650XT', 'Moto', NULL, 'Turistica - 600cc', 'tipo_a2', NULL, 'Parcheggio Roma', '', 5, 'Moto Turistica da 600c-Patente richiesta: A2-Carburante: Benzina', '/images/Suzuki-VStrom-650XT.jpg'),
(395737, 'Obi', 'Monopattino', NULL, NULL, 'no', NULL, 'Parcheggio Calatafimi', '', 2, 'Monopattino elettrico', '/images/obi.jpg'),
(457239, 'Piaggio Liberty 2T', 'Moto', NULL, 'Ciclomotore - 50cc', 'tipo_am', NULL, 'Parcheggio Oreto', '', 3, 'Ciclomotore da 50cc-Patente richiesta: AM-Carburante: Benzina', '/images/Piaggio-Liberty-2T.jpg'),
(536264, 'Dacia Duster', 'Automobile', 'Suv', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 6, 'Suv 4x4-Cambio Manuale-Carburante: Benzina', '/images/carosello1.jpeg'),
(652964, 'Rockrider gialla', 'Bicicletta', NULL, NULL, 'no', NULL, 'Parcheggio Oreto', '', 2, 'Mountain Bike', '/images/Bici.jpg'),
(663481, 'Rockrider nera', 'Bicicletta', NULL, NULL, 'no', NULL, 'Parcheggio Oreto', '', 2, 'Mountain Bike', '/images/rockrider.jpg'),
(692682, 'Yamaha Super Teneré XT1200Z', 'Moto', NULL, 'Adventure - 1200cc', 'tipo_a', NULL, 'Parcheggio Roma', '', 6, 'Moto Adventure da 1200cc-Patente richiesta: A-Carburante: Benzina', '/images/Yamaha-Super-Tenere-XT1200Z.jpg'),
(729264, 'Piaggio Liberty 125 ABS', 'Moto', NULL, 'Scooter - 125cc', 'tipo_a1', NULL, 'Parcheggio Calatafimi', '', 4, 'Scooter da 125cc-Patente richiesta: A1-Carburante: Benzina', '/images/piaggio-liberty-abs-125.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id_account`);

--
-- Indexes for table `carte_di_credito`
--
ALTER TABLE `carte_di_credito`
  ADD PRIMARY KEY (`ref_account`) USING BTREE,
  ADD KEY `ref_account1` (`ref_account`);

--
-- Indexes for table `parcheggi`
--
ALTER TABLE `parcheggi`
  ADD PRIMARY KEY (`id_parcheggio`),
  ADD KEY `ref_addetto` (`ref_addetto`);

--
-- Indexes for table `patenti`
--
ALTER TABLE `patenti`
  ADD PRIMARY KEY (`ref_account`) USING BTREE,
  ADD KEY `ref_account` (`ref_account`);

--
-- Indexes for table `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD PRIMARY KEY (`id_prenotazione`),
  ADD KEY `ref_autista` (`ref_autista`),
  ADD KEY `ref_carta` (`ref_carta`),
  ADD KEY `ref_cliente` (`ref_cliente`),
  ADD KEY `ref_veicolo` (`ref_veicolo`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `veicoli`
--
ALTER TABLE `veicoli`
  ADD PRIMARY KEY (`id_veicolo`),
  ADD KEY `ref_parcheggio` (`ref_parcheggio`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id_account` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `prenotazioni`
--
ALTER TABLE `prenotazioni`
  MODIFY `id_prenotazione` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carte_di_credito`
--
ALTER TABLE `carte_di_credito`
  ADD CONSTRAINT `ref_account1` FOREIGN KEY (`ref_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
