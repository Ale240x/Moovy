-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Set 04, 2021 alle 17:50
-- Versione del server: 10.4.19-MariaDB
-- Versione PHP: 8.0.7

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
-- Struttura della tabella `account`
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
-- Dump dei dati per la tabella `account`
--

INSERT INTO `account` (`id_account`, `ruolo`, `nome`, `cognome`, `data_di_nascita`, `num_telefono`, `password`, `email`) VALUES
(1, 'Amministratore', 'Mario', 'Rossi', '1992-07-15', '3281234567', 'Password1', 'amministratore@mail.it'),
(2, 'Addetto', 'Giuseppe', 'Verdi', '1994-07-01', '3771234567', 'Password1', 'addetto2@mail.it'),
(3, 'Addetto', 'Francesco', 'Neri', '1997-04-03', '3213216547', 'Password1', 'addetto3@mail.it'),
(4, 'Cliente', 'Luisa', 'Gialli', '2001-10-25', '3681234567', 'Password1', 'cliente@mail.it'),
(5, 'Autista', 'Guido', 'Marroni', '1992-09-15', '3331234657', 'Password1', 'autista@mail.it'),
(6, 'Cliente', 'Gino', 'Fiori', '1993-12-08', '3321234657', 'Password1', 'gino@mail.it'),
(7, 'Addetto', 'Mario', 'Bianchi', '1997-02-10', '3407654185', 'Password1', 'addetto7@mail.it'),
(8, 'Addetto', 'Maria', 'Bronte', '1997-03-10', '3407554185', 'Password1', 'addetto8@mail.it');

-- --------------------------------------------------------

--
-- Struttura della tabella `carte_di_credito`
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
-- Dump dei dati per la tabella `carte_di_credito`
--

INSERT INTO `carte_di_credito` (`numero_carta`, `ref_account`, `nome_intestatario`, `cognome_intestatario`, `scadenza_carta`, `cvv`) VALUES
('8600123456791231', 4, 'Luisa', 'Gialli', '07/24', 123);

-- --------------------------------------------------------

--
-- Struttura della tabella `parcheggi`
--

CREATE TABLE `parcheggi` (
  `id_parcheggio` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `indirizzo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_addetto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `parcheggi`
--

INSERT INTO `parcheggi` (`id_parcheggio`, `indirizzo`, `ref_addetto`) VALUES
('Parcheggio Basile', 'Via Ernesto Basile 110', 2),
('Parcheggio Calatafimi', 'Corso Calatafimi 9', 3),
('Parcheggio Oreto', 'Via Oreto 20', 7),
('Parcheggio Roma', 'Via Roma 97', 8);

-- --------------------------------------------------------

--
-- Struttura della tabella `patenti`
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
-- Dump dei dati per la tabella `patenti`
--

INSERT INTO `patenti` (`codice_patente`, `scadenza_patente`, `tipo_a`, `tipo_b`, `tipo_am`, `tipo_a1`, `tipo_a2`, `ref_account`) VALUES
('023944', '2023-03-01', 1, 1, 1, 1, 1, 4);

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazioni`
--

CREATE TABLE `prenotazioni` (
  `id_prenotazione` int(11) NOT NULL,
  `ref_cliente` int(11) NOT NULL,
  `ref_autista` int(11) DEFAULT NULL,
  `tipo_veicolo` enum('Automobile','Moto','Bicicletta','Monopattino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_veicolo` int(11) NOT NULL,
  `mancia` float DEFAULT NULL,
  `ref_carta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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

-- --------------------------------------------------------

--
-- Struttura della tabella `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `veicoli`
--

CREATE TABLE `veicoli` (
  `id_veicolo` int(11) NOT NULL,
  `nome_veicolo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_veicolo` enum('Automobile','Moto','Bicicletta','Monopattino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `modello_auto` enum('Suv','Utilitaria','Berlina') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modello_moto` enum('Ciclomotore - 50cc','Scooter - 125cc','Turistica - 600cc','Adventure - 1200cc') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patente_richiesta` enum('tipo_a','tipo_b','tipo_am','tipo_a1','tipo_a2', 'no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `stato_veicolo` enum('Ritirato','Riconsegnato') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_parcheggio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `posizione` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tariffa` float NOT NULL,
  `descrizione` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `immagine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `veicoli`
--

INSERT INTO `veicoli` (`id_veicolo`, `nome_veicolo`, `tipo_veicolo`, `modello_auto`, `modello_moto`, `patente_richiesta`, `stato_veicolo`, `ref_parcheggio`, `posizione`, `tariffa`, `descrizione`, `immagine`) VALUES
(536264, 'Dacia Duster', 'Automobile', 'Suv', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 6, 'Suv 4x4-Cambio Manuale-Carburante: Benzina', '/images/carosello1.jpeg'),
(198730, 'Xiaomi', 'Monopattino', NULL, NULL, 'no', NULL, 'Parcheggio Calatafimi', '', 2, 'Monopattino elettrico', '/images/xiaomi.jpg'),
(395737, 'Obi', 'Monopattino', NULL, NULL, 'no', NULL, 'Parcheggio Calatafimi', '', 2, 'Monopattino elettrico', '/images/obi.jpg'),
(663481, 'Rockrider nera', 'Bicicletta', NULL, NULL, 'no', NULL, 'Parcheggio Oreto', '', 2, 'Mountain Bike', '/images/rockrider.jpg'),
(652964, 'Rockrider gialla', 'Bicicletta', NULL, NULL, 'no', NULL, 'Parcheggio Oreto', '', 2, 'Mountain Bike', '/images/Bici.jpg'),
(288634, 'Ducati Multistrada V4', 'Moto', NULL, 'Adventure - 1200cc', 'tipo_a', NULL, 'Parcheggio Roma', '', 5, 'Moto Adventure da 1200cc-Patente richiesta: A-Carburante: Benzina', '/images/Ducati-Multistrada.jpg'),
(172946, 'Citroen C3', 'Automobile', 'Utilitaria', NULL, 'tipo_b', NULL, 'Parcheggio Oreto', '', 4, 'Utilitaria 5 porte-Cambio Manuale-Carburante: Benzina', '/images/C3.jpg'),
(302750, 'Yamaha Tracer 900', 'Moto', NULL, 'Turistica - 600cc', 'tipo_a2', NULL, 'Parcheggio Roma', '', 6, 'Moto Turistica da 600cc-Patente richiesta: A2-Carburante: Benzina', '/images/Yamaha-Tracer-900.jpg'),
(302864, 'Suzuki VStrom 650XT', 'Moto', NULL, 'Turistica - 600cc', 'tipo_a2', NULL, 'Parcheggio Roma', '', 5, 'Moto Turistica da 600c-Patente richiesta: A2-Carburante: Benzina', '/images/Suzuki-VStrom-650XT.jpg'),
(692682, 'Yamaha Super Teneré XT1200Z', 'Moto', NULL, 'Adventure - 1200cc', 'tipo_a', NULL, 'Parcheggio Roma', '', 6, 'Moto Adventure da 1200cc-Patente richiesta: A-Carburante: Benzina', '/images/Yamaha-Super-Tenere-XT1200Z.jpg'),
(174026, 'Nissan Qashqai', 'Automobile', 'Suv', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 6, 'Suv 5 porte-Cambio Manuale-Carburante: Benzina', '/images/Nissan-Qashqai.jpg'),
(283649, 'Fiat 500', 'Automobile', 'Utilitaria', NULL, 'tipo_b', NULL, 'Parcheggio Oreto', '', 5, 'Utilitaria 5 porte-Cambio Manuale-Carburante: Benzina', '/images/fiat-500.jpg'),
(156780, 'BMW Serie 3', 'Automobile', 'Berlina', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 4, 'Berlina 5 porte-Cambio Manuale-Carburante: Benzina', '/images/bmw-serie-3.jpg'),
(201936, 'Audi A4', 'Automobile', 'Berlina', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 4, 'Berlina 5 porte-Cambio Manuale-Carburante: Benzina', '/images/Audi-A4.jpg'),
(729264, 'Piaggio Liberty 125 ABS', 'Moto', NULL, 'Scooter - 125cc', 'tipo_a1', NULL, 'Parcheggio Calatafimi', '', 4, 'Scooter da 125cc-Patente richiesta: A1-Carburante: Benzina', '/images/piaggio-liberty-abs-125.jpg'),
(203847, 'Honda Sh 125i', 'Moto', NULL, 'Scooter - 125cc', 'tipo_a1', NULL, 'Parcheggio Calatafimi', '', 4, 'Scooter da 125cc-Patente richiesta: A1-Carburante: Benzina', '/images/honda-sh-125i.jpg'),
(109364, 'Vespa Primavera', 'Moto', NULL, 'Ciclomotore - 50cc', 'tipo_am', NULL, 'Parcheggio Oreto', '', 3, 'Ciclomotore da 50cc-Patente richiesta: AM-Carburante: Benzina', '/images/Vespa-Primavera.jpg'),
(457239, 'Piaggio Liberty 2T', 'Moto', NULL, 'Ciclomotore - 50cc', 'tipo_am', NULL, 'Parcheggio Oreto', '', 3, 'Ciclomotore da 50cc-Patente richiesta: AM-Carburante: Benzina', '/images/Piaggio-Liberty-2T.jpg');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id_account`);

--
-- Indici per le tabelle `carte_di_credito`
--
ALTER TABLE `carte_di_credito`
  ADD PRIMARY KEY (`numero_carta`),
  ADD KEY `ref_account1` (`ref_account`);

--
-- Indici per le tabelle `parcheggi`
--
ALTER TABLE `parcheggi`
  ADD PRIMARY KEY (`id_parcheggio`),
  ADD KEY `ref_addetto` (`ref_addetto`);

--
-- Indici per le tabelle `patenti`
--
ALTER TABLE `patenti`
  ADD PRIMARY KEY (`codice_patente`),
  ADD KEY `ref_account` (`ref_account`);

--
-- Indici per le tabelle `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD PRIMARY KEY (`id_prenotazione`),
  ADD KEY `ref_autista` (`ref_autista`),
  ADD KEY `ref_carta` (`ref_carta`),
  ADD KEY `ref_cliente` (`ref_cliente`),
  ADD KEY `ref_veicolo` (`ref_veicolo`);

--
-- Indici per le tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indici per le tabelle `veicoli`
--
ALTER TABLE `veicoli`
  ADD PRIMARY KEY (`id_veicolo`),
  ADD KEY `ref_parcheggio` (`ref_parcheggio`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `account`
--
ALTER TABLE `account`
  MODIFY `id_account` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  MODIFY `id_prenotazione` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `carte_di_credito`
--
ALTER TABLE `carte_di_credito`
  ADD CONSTRAINT `ref_account1` FOREIGN KEY (`ref_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `parcheggi`
--
ALTER TABLE `parcheggi`
  ADD CONSTRAINT `ref_addetto` FOREIGN KEY (`ref_addetto`) REFERENCES `account` (`id_account`) ON UPDATE CASCADE;

--
-- Limiti per la tabella `patenti`
--
ALTER TABLE `patenti`
  ADD CONSTRAINT `ref_account` FOREIGN KEY (`ref_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD CONSTRAINT `ref_autista` FOREIGN KEY (`ref_autista`) REFERENCES `account` (`id_account`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ref_carta` FOREIGN KEY (`ref_carta`) REFERENCES `carte_di_credito` (`numero_carta`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ref_cliente` FOREIGN KEY (`ref_cliente`) REFERENCES `account` (`id_account`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ref_veicolo` FOREIGN KEY (`ref_veicolo`) REFERENCES `veicoli` (`id_veicolo`);

--
-- Limiti per la tabella `veicoli`
--
ALTER TABLE `veicoli`
  ADD CONSTRAINT `ref_parcheggio` FOREIGN KEY (`ref_parcheggio`) REFERENCES `parcheggi` (`id_parcheggio`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
