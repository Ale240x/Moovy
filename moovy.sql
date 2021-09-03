-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Lug 19, 2021 alle 17:25
-- Versione del server: 10.4.19-MariaDB
-- Versione PHP: 8.0.6

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
  `id_parcheggio` varchar(255) NOT NULL,
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
-- Struttura della tabella `veicoli`
--

CREATE TABLE `veicoli` (
  `id_veicolo` int(11) NOT NULL,
  `nome_veicolo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_veicolo` enum('Automobile','Moto','Bicicletta','Monopattino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `modello_auto` enum('Suv','Utilitaria','Berlina') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modello_moto` enum('Ciclomotore - 50cc','Scooter - 125cc','Turistica - 600cc','Adventure - 1200cc') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `patente_richiesta` enum('tipo_a','tipo_b','tipo_am','tipo_a1','tipo_a2') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stato_veicolo` enum('Ritirato','Riconsegnato') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_parcheggio` varchar(255) DEFAULT NULL,
  `posizione` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tariffa` float NOT NULL,
  `descrizione` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `immagine` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `veicoli`
--

INSERT INTO `veicoli` (`id_veicolo`, `nome_veicolo`, `tipo_veicolo`, `modello_auto`, `modello_moto`, `patente_richiesta`, `stato_veicolo`, `ref_parcheggio`, `posizione`, `tariffa`, `descrizione`, `immagine`) VALUES
(53626, 'Dacia Duster', 'Automobile', 'Suv', NULL, 'tipo_b', NULL, 'Parcheggio Basile', '', 6, '', NULL),
(198730, 'Xiaomi', 'Monopattino', NULL, NULL, NULL, NULL, 'Parcheggio Calatafimi', '', 2, '', NULL),
(663481, 'Rockrider', 'Bicicletta', NULL, NULL, NULL, NULL, NULL, 'Via Libertà, 12', 2, '', NULL);

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
  MODIFY `id_account` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
